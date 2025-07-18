import fs from 'fs';
import path from 'path';
import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/list', (req, res) => {
  const uploadDir = path.resolve('uploads');
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Could not read uploads folder' });

    const fileUrls = files.map((name) => `/uploads/${name}`);
    res.json(fileUrls);
  });
});


router.post('/', verifyToken, (req, res) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'Image is too large. Max size is 10MB' });
      }
      console.error('❌ Multer error:', err);
      return res.status(500).json({ error: 'Upload failed', detail: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ message: 'Upload successful', fileUrl });
  });
});
router.delete('/:filename', verifyToken, (req, res) => {
  const filePath = path.resolve('uploads', req.params.filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('❌ Error deleting file:', err);
      return res.status(500).json({ error: 'Could not delete file' });
    }
    res.json({ message: 'File deleted successfully' });
  });
});

export default router;
