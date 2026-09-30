import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      index: true,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: [true, 'Board ID is required'],
      index: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Client ID is required'],
      index: true,
    },
    advertiserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Advertiser ID is required'],
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration in days is required'],
      min: [1, 'Duration must be at least 1 day'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    priceBreakdown: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
        message: '{VALUE} is not a valid booking status',
      },
      default: 'pending',
      index: true,
    },
    bookingType: {
      type: String,
      enum: ['exclusive', 'digital_slot'],
      default: 'exclusive',
    },
    digitalConfig: {
      adDurationSeconds: { type: Number, default: 10 },
      loopIntervalSeconds: { type: Number, default: 60 },
      dailyStartTime: { type: String, default: '10:00' },
      dailyEndTime: { type: String, default: '22:00' },
      dailyHours: { type: Number, default: 12 },
      playsPerHour: { type: Number, default: 60 },
      playsPerDay: { type: Number, default: 720 },
      totalPlays: { type: Number, default: 21600 },
      slotSharePercent: { type: Number, default: 16.67 },
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
      index: true,
    },
    paidAt: {
      type: Date,
    },
    razorpayOrderId: {
      type: String,
      trim: true,
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
    },
    campaignNotes: {
      type: String,
      trim: true,
      default: '',
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: '',
    },
    approvedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate human-readable bookingId before saving if not provided
bookingSchema.pre('save', async function (next) {
  if (!this.bookingId) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.bookingId = `FA-BKG-${Date.now().toString().slice(-4)}${randomSuffix}`;
  }
  next();
});

// Compound indexes for double-booking collision queries and dashboard aggregations
bookingSchema.index({ boardId: 1, status: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ clientId: 1, createdAt: -1 });
bookingSchema.index({ advertiserId: 1, createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
