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


router.post(
  '/',
  verifyToken,
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ message: 'Upload successful', fileUrl });
  }
);

export default router;
