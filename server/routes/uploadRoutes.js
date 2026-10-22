import express from 'express';
import { uploadImage, uploadMiddleware } from '../controllers/uploadController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected: Only advertisers and admins can upload board images
router.use(protect);
router.use(authorize('advertiser', 'admin'));

// Handles either single 'image' or array 'images' (up to 8 files)
router.post('/', uploadMiddleware.array('images', 8), uploadImage);

export default router;
