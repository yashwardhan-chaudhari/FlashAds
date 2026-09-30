import Review from '../models/Review.js';
import Board from '../models/Board.js';

/**
 * @desc    Create review for a board after completed campaign (Phase 23)
 * @route   POST /api/reviews
 * @access  Private (Client / Admin)
 */
export const createReview = async (req, res) => {
  try {
    const { boardId, rating, comment, bookingId } = req.body;

    if (!boardId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Board ID, rating (1-5), and review comment are required',
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 1 and 5',
      });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found',
      });
    }

    const review = new Review({
      boardId,
      clientId: req.user._id,
      bookingId: bookingId || null,
      rating: numRating,
      comment: comment.trim(),
    });

    await review.save();

    // Recompute board average rating
    const allReviews = await Review.find({ boardId });
    const avgRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1);

    const populated = await Review.findById(review._id)
      .populate('clientId', 'name email role');

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: populated,
      averageRating: Number(avgRating),
      totalReviews: allReviews.length,
    });
  } catch (error) {
    console.error('Create review error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error submitting review',
    });
  }
};

/**
 * @desc    Get all reviews for a board
 * @route   GET /api/reviews/board/:boardId
 * @access  Public
 */
export const getBoardReviews = async (req, res) => {
  try {
    const { boardId } = req.params;

    const reviews = await Review.find({ boardId })
      .populate('clientId', 'name role')
      .sort({ createdAt: -1 });

    const total = reviews.length;
    const avg = total > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
      : '5.0';

    return res.status(200).json({
      success: true,
      count: total,
      averageRating: Number(avg),
      reviews,
    });
  } catch (error) {
    console.error('Get board reviews error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving reviews',
    });
  }
};
