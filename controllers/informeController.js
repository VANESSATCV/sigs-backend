// backend/controllers/informeController.js
import Informe from '../models/Informe.js';
import fs from 'fs';
import path from 'path';

// GET /api/informes
export const getInformes = async (req, res) => {
  try {
    const informes = await Informe.find().sort({ fecha: -1 });
    res.json(informes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener informes', error });
  }
};

// GET /api/informes/gallery?page=&limit=
export const getInformesGallery = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const informes = await Informe.find()
      .skip(skip)
      .limit(limit)
      .sort({ fecha: -1 });

    const total = await Informe.countDocuments();

    res.json({ informes, total });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener informes', error });
  }
};

// POST /api/informes
export const createInforme = async (req, res) => {
  const { nombre, descripcion, esPara } = req.body;
  const imagen = req.file?.filename;

  if (!nombre || !descripcion || !esPara) {
    return res.status(400).json({ message: 'Campos obligatorios faltantes' });
  }

  try {
    const nuevoInforme = new Informe({ nombre, descripcion, esPara, imagen });
    await nuevoInforme.save();
    res.status(201).json({ message: 'Informe creado correctamente', informe: nuevoInforme });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear informe', error });
  }
};

// PUT /api/informes/:id
export const updateInforme = async (req, res) => {
  const { nombre, descripcion, esPara } = req.body;

  if (!nombre || !descripcion || !esPara) {
    return res.status(400).json({ message: 'Campos obligatorios faltantes' });
  }

  try {
    const informe = await Informe.findById(req.params.id);
    if (!informe) return res.status(404).json({ message: 'Informe no encontrado' });

    // Si subieron nueva imagen, eliminar la anterior
    if (req.file) {
      if (informe.imagen) {
        const oldPath = path.join(process.cwd(), 'uploads', informe.imagen);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      informe.imagen = req.file.filename;
    }

    informe.nombre = nombre;
    informe.descripcion = descripcion;
    informe.esPara = esPara;

    const updated = await informe.save();
    res.json({ message: 'Informe actualizado correctamente', informe: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar informe', error });
  }
};

// DELETE /api/informes/:id
export const deleteInforme = async (req, res) => {
  try {
    const informe = await Informe.findById(req.params.id);
    if (!informe) return res.status(404).json({ message: 'Informe no encontrado' });

    if (informe.imagen) {
      const imagePath = path.join(process.cwd(), 'uploads', informe.imagen);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await informe.deleteOne();
    res.json({ message: 'Informe eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar informe', error });
  }
};
