const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const multer = require('multer');

const UPLOAD_DIR = path.join(__dirname, '../../public/uploads/items');

// Public URL prefix for uploaded item images (served by express.static)
const ITEM_IMAGE_URL_PREFIX = '/uploads/items';

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpeg', '.jpg', '.png', '.webp'];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isMimeAllowed = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const isExtAllowed = ALLOWED_EXTENSIONS.includes(ext);

  if (isMimeAllowed && isExtAllowed) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
  },
});

/**
 * Product images: exactly one main image + up to 5 gallery images.
 * Multipart fields: `mainImage` (single) and `galleryImages` (multiple).
 *
 * Wraps multer so upload errors become clean 400 responses instead of
 * falling through to the generic 500 handler.
 */
const productImagesUpload = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 5 },
]);

function uploadProductImages(req, res, next) {
  productImagesUpload(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      const messages = {
        LIMIT_FILE_SIZE: 'Each image must be 5MB or smaller',
        LIMIT_UNEXPECTED_FILE:
          'Unexpected upload field. Use "mainImage" (1 file) and "galleryImages" (up to 5 files)',
        LIMIT_FILE_COUNT: 'Too many files uploaded',
      };
      return res.status(400).json({
        message: messages[error.code] || `Upload failed: ${error.message}`,
      });
    }

    return res.status(400).json({ message: error.message });
  });
}

/**
 * Collects every file multer attached to the request, regardless of which
 * API was used (.single -> req.file, .array -> req.files[], .fields -> req.files{}).
 */
function collectUploadedFiles(req) {
  const files = [];

  if (req.file) {
    files.push(req.file);
  }

  if (req.files) {
    if (Array.isArray(req.files)) {
      files.push(...req.files);
    } else {
      Object.values(req.files).forEach((group) => {
        if (Array.isArray(group)) files.push(...group);
      });
    }
  }

  return files;
}

/**
 * Deletes files that were written to disk by multer for a request that is
 * being rejected (validation failure, business-rule failure, …), so no
 * orphan files are left behind on the server.
 */
async function cleanupUploadedFiles(req) {
  const files = collectUploadedFiles(req);
  if (files.length === 0) return;

  await Promise.all(
    files.map(async (file) => {
      if (!file?.path) return;
      try {
        await fsPromises.unlink(file.path);
      } catch (error) {
        // Already gone is fine; anything else should be visible in logs
        if (error.code !== 'ENOENT') {
          console.error(
            `Failed to delete orphan upload "${file.path}":`,
            error.message
          );
        }
      }
    })
  );
}

module.exports = upload;
module.exports.uploadProductImages = uploadProductImages;
module.exports.cleanupUploadedFiles = cleanupUploadedFiles;
module.exports.ITEM_IMAGE_URL_PREFIX = ITEM_IMAGE_URL_PREFIX;
