import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a board title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description of the advertising space'],
      trim: true,
    },
    boardType: {
      type: String,
      required: [true, 'Please specify the board format/type'],
      enum: {
        values: [
          'hoarding',
          'unipole',
          'LED digital screen',
          'banner',
          'bus shelter',
          'gantry',
          'other',
        ],
        message: '{VALUE} is not a supported board type',
      },
      default: 'hoarding',
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      default: 'Pune',
      trim: true,
    },
    area: {
      type: String,
      required: [true, 'Area / Locality is required (e.g. Hinjewadi, FC Road)'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Street address or landmark is required'],
      trim: true,
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude coordinate is required for map placement'],
      default: 18.5204, // Central Pune default
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude coordinate is required for map placement'],
      default: 73.8567, // Central Pune default
    },
    width: {
      type: Number,
      required: [true, 'Width in feet is required'],
      min: [1, 'Width must be at least 1 foot'],
    },
    height: {
      type: Number,
      required: [true, 'Height in feet is required'],
      min: [1, 'Height must be at least 1 foot'],
    },
    trafficLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'very high'],
      default: 'high',
    },
    visibility: {
      type: String,
      default: 'Front Facing - Lit at Night',
      trim: true,
    },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length >= 1 && v.length <= 8;
        },
        message: 'A board must have between 1 and 8 images',
      },
      required: [true, 'At least 1 board image is required'],
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Daily rate is required'],
      min: [0, 'Price per day cannot be negative'],
    },
    pricePerWeek: {
      type: Number,
      required: [true, 'Weekly rate is required'],
      min: [0, 'Price per week cannot be negative'],
    },
    pricePerMonth: {
      type: Number,
      required: [true, 'Monthly rate is required'],
      min: [0, 'Price per month cannot be negative'],
    },
    availableFrom: {
      type: Date,
      default: Date.now,
    },
    availableUntil: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'unavailable'],
      default: 'pending', // All boards start in pending for admin review
      index: true,
    },
    rejectionReason: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast marketplace search and filtering
boardSchema.index({ city: 1, area: 1, boardType: 1, status: 1, pricePerMonth: 1 });
boardSchema.index({ status: 1, createdAt: -1 });

const Board = mongoose.model('Board', boardSchema);

export default Board;
