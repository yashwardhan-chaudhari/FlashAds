import Board from '../models/Board.js';
import { calculateDurationPrice, getDaysBetweenDates } from '../services/pricingEngine.js';

/**
 * @desc    Calculate duration pricing quote for a board and date range
 * @route   POST /api/pricing/quote
 * @access  Public
 */
export const getPriceQuote = async (req, res) => {
  try {
    const { boardId, startDate, endDate, durationDays, pricePerDay, pricePerWeek, pricePerMonth } = req.body;

    let days = durationDays;
    let dayRate = pricePerDay;
    let weekRate = pricePerWeek;
    let monthRate = pricePerMonth;

    if (boardId) {
      const board = await Board.findById(boardId);
      if (!board) {
        return res.status(404).json({
          success: false,
          message: 'Board not found',
        });
      }
      dayRate = board.pricePerDay;
      weekRate = board.pricePerWeek;
      monthRate = board.pricePerMonth;

      if (startDate && endDate) {
        days = getDaysBetweenDates(startDate, endDate);
      }
    } else if (startDate && endDate) {
      days = getDaysBetweenDates(startDate, endDate);
    }

    if (!days || days <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date range or duration',
      });
    }

    const quote = calculateDurationPrice(days, dayRate, weekRate, monthRate);

    return res.status(200).json({
      success: true,
      quote,
    });
  } catch (error) {
    console.error('Pricing quote error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error generating price quote',
    });
  }
};
