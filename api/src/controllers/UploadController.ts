import { Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

const UPLOAD_DIR = path.join(__dirname, '..', '..', '..', 'frontend', 'public', 'screenshots');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export class UploadController {
  static async uploadScreenshot(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      // Generate a unique filename to avoid conflicts
      const originalName = req.file.originalname;
      const ext = path.extname(originalName);
      const baseName = path.basename(originalName, ext);
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileName = `${baseName}-${timestamp}-${randomStr}${ext}`;
      
      // Optional: organize by project slug if provided
      const projectSlug = req.body.projectSlug || 'uploads';
      const projectDir = path.join(UPLOAD_DIR, projectSlug);
      
      // Create project directory if it doesn't exist
      if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir, { recursive: true });
      }
      
      const filePath = path.join(projectDir, fileName);
      
      // Move file from temp location to final location
      try {
        fs.renameSync(req.file.path, filePath);
      } catch (moveError) {
        // Clean up temp file if move fails
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        throw moveError;
      }
      
      // Return the public URL path
      const publicPath = `/screenshots/${projectSlug}/${fileName}`;
      
      res.json({
        success: true,
        path: publicPath,
        fileName: fileName,
        originalName: originalName,
      });
    } catch (error) {
      console.error('Upload error:', error);
      
      // Clean up temp file on error
      if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error('Failed to clean up temp file:', cleanupError);
        }
      }
      
      res.status(500).json({ 
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async deleteScreenshot(req: Request, res: Response): Promise<void> {
    try {
      const { path: filePath } = req.body;
      
      if (!filePath || !filePath.startsWith('/screenshots/')) {
        res.status(400).json({ error: 'Invalid file path' });
        return;
      }
      
      // Remove leading slash and construct full path
      const relativePath = filePath.substring(1); // Remove leading /
      const fullPath = path.join(__dirname, '..', '..', '..', 'frontend', 'public', relativePath);
      
      // Security check: ensure file is within screenshots directory
      const screenshotsDir = path.join(__dirname, '..', '..', '..', 'frontend', 'public', 'screenshots');
      const resolvedPath = path.resolve(fullPath);
      const resolvedScreenshotsDir = path.resolve(screenshotsDir);
      
      if (!resolvedPath.startsWith(resolvedScreenshotsDir)) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }
      
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        res.json({ success: true, message: 'File deleted successfully' });
      } else {
        res.status(404).json({ error: 'File not found' });
      }
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ 
        error: 'Failed to delete file',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

