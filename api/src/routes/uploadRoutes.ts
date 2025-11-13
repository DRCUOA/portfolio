import { Router, Request } from 'express';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { UploadController } from '../controllers/UploadController';

const router = Router();

// Configure upload directory
const UPLOAD_DIR = path.join(__dirname, '..', '..', '..', 'frontend', 'public', 'screenshots');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use temp directory, we'll move files after validation
    const tempDir = path.join(UPLOAD_DIR, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Generate temporary filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    cb(null, `temp-${timestamp}-${randomStr}${path.extname(file.originalname)}`);
  },
});

// File filter for images only
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Routes
router.post('/screenshot', upload.single('image'), UploadController.uploadScreenshot);
router.delete('/screenshot', UploadController.deleteScreenshot);

export default router;

