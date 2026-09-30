import Board from '../models/Board.js';
import User from '../models/User.js';

/**
 * @desc    Get all pending boards for admin review
 * @route   GET /api/admin/boards/pending
 * @access  Private (Admin)
 */
export const getPendingBoards = async (req, res) => {
  try {
    const pendingBoards = await Board.find({ status: 'pending' })
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: pendingBoards.length,
      boards: pendingBoards,
    });
  } catch (error) {
    console.error('Get pending boards error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving pending boards queue',
    });
  }
};

/**
 * @desc    Get all boards across all statuses
 * @route   GET /api/admin/boards
 * @access  Private (Admin)
 */
export const getAllAdminBoards = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const boards = await Board.find(query)
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: boards.length,
      boards,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving all boards',
    });
  }
};

/**
 * @desc    Approve a pending board (Makes it public on Explore)
 * @route   PATCH /api/admin/boards/:id/approve
 * @access  Private (Admin)
 */
export const approveBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).populate('ownerId', 'name email phone');

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found',
      });
    }

    board.status = 'approved';
    board.rejectionReason = '';
    await board.save();

    return res.status(200).json({
      success: true,
      message: `Board "${board.title}" has been approved and is now live on Explore!`,
      board,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error approving board',
    });
  }
};

/**
 * @desc    Reject a pending board with a reason
 * @route   PATCH /api/admin/boards/:id/reject
 * @access  Private (Admin)
 */
export const rejectBoard = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A rejection reason is required to inform the board owner',
      });
    }

    const board = await Board.findById(req.params.id).populate('ownerId', 'name email phone');

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found',
      });
    }

    board.status = 'rejected';
    board.rejectionReason = reason.trim();
    await board.save();

    return res.status(200).json({
      success: true,
      message: `Board "${board.title}" was rejected with feedback.`,
      board,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error rejecting board',
    });
  }
};

/**
 * @desc    Get Platform Overview Statistics for Admin Dashboard
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalClients,
      totalAdvertisers,
      totalBoards,
      approvedBoards,
      pendingBoards,
      rejectedBoards,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'client' }),
      User.countDocuments({ role: 'advertiser' }),
      Board.countDocuments(),
      Board.countDocuments({ status: 'approved' }),
      Board.countDocuments({ status: 'pending' }),
      Board.countDocuments({ status: 'rejected' }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalClients,
        totalAdvertisers,
        totalBoards,
        approvedBoards,
        pendingBoards,
        rejectedBoards,
        totalRevenueVolume: 1480000,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving admin statistics',
    });
  }
};
