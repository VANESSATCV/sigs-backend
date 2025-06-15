// backend/routes/informeRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getInformes,
  getInformesGallery,
  createInforme,
  updateInforme,
  deleteInforme,
} from '../controllers/informeController.js';

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

// CRUD
router.get('/', getInformes);
router.get('/gallery', getInformesGallery);
router.post('/', upload.single('imagen'), createInforme);
router.put('/:id', upload.single('imagen'), updateInforme);
router.delete('/:id', deleteInforme);

export default router;
