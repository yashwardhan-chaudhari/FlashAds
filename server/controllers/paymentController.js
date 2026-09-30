import crypto from 'crypto';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';

/**
 * @desc    Create Razorpay Order for approved booking
 * @route   POST /api/payments/create-order
 * @access  Private (Client / Admin)
 */
export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate('boardId');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this booking',
      });
    }

    if (booking.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: `Cannot pay for booking with status '${booking.status}'. Must be approved by owner first.`,
      });
    }

    // Generate Razorpay mock/live order parameters
    const orderId = `order_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const amountInPaise = Math.round(booking.totalAmount * 100);

    return res.status(200).json({
      success: true,
      order: {
        id: orderId,
        entity: 'order',
        amount: amountInPaise,
        amount_due: amountInPaise,
        currency: 'INR',
        receipt: booking.bookingId || `rcpt_${booking._id}`,
        status: 'created',
      },
      booking: {
        id: booking._id,
        bookingId: booking.bookingId,
        boardTitle: booking.boardId?.title,
        amount: booking.totalAmount,
        currency: 'INR',
      },
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_flashads_demo',
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating payment order',
    });
  }
};

/**
 * @desc    Verify Razorpay payment signature and confirm booking
 * @route   POST /api/payments/verify
 * @access  Private
 */
export const verifyPayment = async (req, res) => {
  try {
    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const booking = await Booking.findById(bookingId).populate('boardId');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // In production with live keys, verify HMAC SHA256 signature
    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_flashads_demo';
    let isSignatureValid = true;

    if (razorpaySignature && razorpaySignature !== 'mock_sig_valid') {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      isSignatureValid = generatedSignature === razorpaySignature;
    }

    if (!isSignatureValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature verification failed',
      });
    }

    // Update booking payment records
    booking.paymentStatus = 'paid';
    booking.paidAt = new Date();
    booking.razorpayOrderId = razorpayOrderId;
    booking.razorpayPaymentId = razorpayPaymentId || `pay_${Date.now()}`;
    await booking.save();

    // Trigger Notification for Advertiser (Phase 19)
    try {
      await Notification.create({
        recipientId: booking.advertiserId,
        senderId: req.user._id,
        type: 'system',
        title: 'Payment Confirmed 💳',
        message: `Payment of ₹${booking.totalAmount.toLocaleString('en-IN')} received for booking ${booking.bookingId} on ${booking.boardId?.title}.`,
        link: '/advertiser/dashboard?tab=requests',
      });
    } catch (e) {
      console.warn('Payment notification error:', e.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and booking confirmed successfully',
      booking,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error verifying payment',
    });
  }
};
