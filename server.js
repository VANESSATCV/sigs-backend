// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import prestamoRoutes from './routes/prestamoRoutes.js';
import informeRoutes from './routes/informeRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/prestamos', prestamoRoutes);
app.use('/api/informes', informeRoutes);

// Servir estáticos de imágenes
app.use('/uploads', express.static('uploads'));

// 404
app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
