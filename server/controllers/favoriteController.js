import Favorite from '../models/Favorite.js';
import Board from '../models/Board.js';

/**
 * @desc    Toggle favorite on a board (Add if not favorited, Remove if favorited)
 * @route   POST /api/favorites/:boardId
 * @access  Private (Client / Admin)
 */
export const toggleFavorite = async (req, res) => {
  try {
    const { boardId } = req.params;
    const userId = req.user._id;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found',
      });
    }

    const existing = await Favorite.findOne({ userId, boardId });

    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return res.status(200).json({
        success: true,
        isFavorited: false,
        message: 'Removed from favorites',
      });
    } else {
      const fav = new Favorite({ userId, boardId });
      await fav.save();
      return res.status(201).json({
        success: true,
        isFavorited: true,
        message: 'Added to favorites',
      });
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating favorites',
    });
  }
};

/**
 * @desc    Get all favorites for logged in user (Phase 18)
 * @route   GET /api/favorites
 * @access  Private
 */
export const getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .populate({
        path: 'boardId',
        select: 'title images city area address boardType width height trafficLevel pricePerDay pricePerWeek pricePerMonth status',
      })
      .sort({ createdAt: -1 });

    const validBoards = favorites
      .filter((f) => f.boardId)
      .map((f) => f.boardId);

    return res.status(200).json({
      success: true,
      count: validBoards.length,
      favorites: validBoards,
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving favorites',
    });
  }
};

/**
 * @desc    Check if board is favorited by current user
 * @route   GET /api/favorites/check/:boardId
 * @access  Private
 */
export const checkIsFavorited = async (req, res) => {
  try {
    const { boardId } = req.params;
    const existing = await Favorite.findOne({ userId: req.user._id, boardId });

    return res.status(200).json({
      success: true,
      isFavorited: !!existing,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      isFavorited: false,
    });
  }
};
