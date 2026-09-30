import Board from '../models/Board.js';

/**
 * @desc    Create a new board listing (Starts as pending)
 * @route   POST /api/boards
 * @access  Private (Advertiser / Owner)
 */
export const createBoard = async (req, res) => {
  try {
    const {
      title,
      description,
      boardType,
      city = 'Pune',
      area,
      address,
      latitude,
      longitude,
      width,
      height,
      trafficLevel = 'high',
      visibility = 'Front Facing - Lit at Night',
      images,
      pricePerDay,
      pricePerWeek,
      pricePerMonth,
      availableFrom,
      availableUntil,
    } = req.body;

    // Validate essential fields
    if (
      !title ||
      !description ||
      !boardType ||
      !area ||
      !address ||
      !width ||
      !height ||
      !pricePerDay ||
      !pricePerWeek ||
      !pricePerMonth
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required board details (title, description, format, location, dimensions, prices)',
        code: 'MISSING_FIELDS',
      });
    }

    // Ensure images array has at least 1 image
    const boardImages = Array.isArray(images) && images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'];

    const board = await Board.create({
      ownerId: req.user._id,
      title: title.trim(),
      description: description.trim(),
      boardType,
      city: city.trim(),
      area: area.trim(),
      address: address.trim(),
      latitude: latitude ? Number(latitude) : 18.5204,
      longitude: longitude ? Number(longitude) : 73.8567,
      width: Number(width),
      height: Number(height),
      trafficLevel,
      visibility: visibility.trim(),
      images: boardImages,
      pricePerDay: Number(pricePerDay),
      pricePerWeek: Number(pricePerWeek),
      pricePerMonth: Number(pricePerMonth),
      availableFrom: availableFrom ? new Date(availableFrom) : new Date(),
      availableUntil: availableUntil ? new Date(availableUntil) : undefined,
      status: 'pending', // Strict PRD requirement: Always starts in pending for admin moderation
      rejectionReason: '',
    });

    return res.status(201).json({
      success: true,
      message: 'Board submitted successfully and is pending admin approval.',
      board,
    });
  } catch (error) {
    console.error('Create board error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating board',
      code: 'SERVER_ERROR',
    });
  }
};

/**
 * @desc    Get all approved boards for public marketplace explore
 * @route   GET /api/boards
 * @access  Public
 */
export const getPublicBoards = async (req, res) => {
  try {
    const {
      city,
      area,
      boardType,
      trafficLevel,
      maxPrice,
      search,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    // Build filter query: MUST BE APPROVED
    const query = { status: 'approved' };

    if (city) query.city = new RegExp(city, 'i');
    if (area && area !== 'All Areas') query.area = new RegExp(area, 'i');
    if (boardType && boardType !== 'all') {
      if (boardType.toLowerCase().includes('led')) {
        query.boardType = 'LED digital screen';
      } else {
        query.boardType = boardType;
      }
    }
    if (trafficLevel && trafficLevel !== 'all') query.trafficLevel = trafficLevel;
    if (maxPrice) query.pricePerMonth = { $lte: Number(maxPrice) };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { area: searchRegex },
        { address: searchRegex },
        { description: searchRegex },
      ];
    }

    // Sort order
    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low') sortOptions = { pricePerMonth: 1 };
    if (sort === 'price-high') sortOptions = { pricePerMonth: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [boards, total] = await Promise.all([
      Board.find(query)
        .populate('ownerId', 'name phone email')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      Board.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      count: boards.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      boards,
    });
  } catch (error) {
    console.error('Get public boards error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving boards',
      code: 'SERVER_ERROR',
    });
  }
};

/**
 * @desc    Get single board by ID
 * @route   GET /api/boards/:id
 * @access  Public (if approved) or Private (owner / admin)
 */
export const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).populate('ownerId', 'name email phone');

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found',
        code: 'NOT_FOUND',
      });
    }

    // If board is not approved, only owner or admin can view
    if (board.status !== 'approved') {
      const isOwner = req.user && board.ownerId._id.toString() === req.user._id.toString();
      const isAdmin = req.user && req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'This board is currently pending review or unavailable',
          code: 'BOARD_NOT_PUBLIC',
        });
      }
    }

    return res.status(200).json({
      success: true,
      board,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching board details',
    });
  }
};

/**
 * @desc    Get all boards owned by the logged-in advertiser
 * @route   GET /api/boards/mine
 * @access  Private (Advertiser)
 */
export const getMyBoards = async (req, res) => {
  try {
    const boards = await Board.find({ ownerId: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: boards.length,
      boards,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching owner boards',
    });
  }
};

/**
 * @desc    Update an owned board (key changes reset status to pending)
 * @route   PUT /api/boards/:id
 * @access  Private (Owner)
 */
export const updateBoard = async (req, res) => {
  try {
    let board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found',
      });
    }

    // Ownership check
    if (board.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own boards',
      });
    }

    // Check if key fields are modified
    const keyFieldsModified =
      req.body.pricePerDay !== undefined ||
      req.body.pricePerWeek !== undefined ||
      req.body.pricePerMonth !== undefined ||
      req.body.width !== undefined ||
      req.body.height !== undefined ||
      req.body.address !== undefined ||
      req.body.area !== undefined;

    // Apply updates
    Object.assign(board, req.body);

    // If key fields were modified on an approved board, reset to pending
    if (keyFieldsModified && board.status === 'approved') {
      board.status = 'pending';
    }

    await board.save();

    return res.status(200).json({
      success: true,
      message: keyFieldsModified
        ? 'Board updated. Key changes sent to admin queue for re-verification.'
        : 'Board updated successfully',
      board,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating board',
    });
  }
};

/**
 * @desc    Toggle board availability (Approved <-> Unavailable)
 * @route   PATCH /api/boards/:id/availability
 * @access  Private (Owner)
 */
export const toggleAvailability = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found',
      });
    }

    if (board.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    board.status = board.status === 'unavailable' ? 'approved' : 'unavailable';
    await board.save();

    return res.status(200).json({
      success: true,
      message: `Board is now ${board.status}`,
      board,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error toggling availability',
    });
  }
};

/**
 * @desc    Delete an owned board
 * @route   DELETE /api/boards/:id
 * @access  Private (Owner)
 */
export const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found',
      });
    }

    if (board.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    await board.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Board deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error deleting board',
    });
  }
};
