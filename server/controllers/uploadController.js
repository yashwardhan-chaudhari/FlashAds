import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Configure Multer to store uploaded files in memory
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and WebP images are allowed.'), false);
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB as specified in PRD FR-BRD-4
  },
  fileFilter,
});

/**
 * Configure Cloudinary with environment variables
 */
const configureCloudinary = () => {
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    return true;
  }
  return false;
};

/**
 * @desc    Upload single or multiple board images
 * @route   POST /api/upload
 * @access  Private (Advertiser / Admin)
 */
export const uploadImage = async (req, res) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one image file to upload',
      });
    }

    const isCloudinaryReady = configureCloudinary();
    const uploadedUrls = [];

    for (const file of files) {
      if (isCloudinaryReady) {
        // Upload to Cloudinary using upload_stream
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'flashads/boards',
              resource_type: 'image',
              transformation: [{ width: 1600, crop: 'limit', quality: 'auto:good' }],
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        uploadedUrls.push(uploadResult.secure_url);
      } else {
        // Fallback for development without Cloudinary credentials:
        // Provide base64 Data URI so images render locally without breaking
        const base64 = file.buffer.toString('base64');
        const dataUri = `data:${file.mimetype};base64,${base64}`;
        uploadedUrls.push(dataUri);
      }
    }

    return res.status(200).json({
      success: true,
      message: `${uploadedUrls.length} image(s) uploaded successfully`,
      urls: uploadedUrls,
      url: uploadedUrls[0], // Convenience for single upload
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error uploading image',
    });
  }
};
