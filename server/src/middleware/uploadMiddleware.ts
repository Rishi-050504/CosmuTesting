import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

/**
 * @description Middleware for handling SRS file uploads (`srs` field).
 */
export const uploadSrs = multer({ storage }).fields([
  { name: 'srs', maxCount: 10 }
]);

/**
 * @description Middleware for handling project zip upload (`project` field).
 */
export const uploadProject = multer({ storage }).fields([
  { name: 'project', maxCount: 1 }
]);