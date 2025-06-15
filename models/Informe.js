// backend/models/Informe.js
import mongoose from 'mongoose';

const informeSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String },
  esPara: {
    type: String,
    enum: ['Dar de baja', 'Mantenimiento'],
    required: true
  },
  fecha: { type: Date, default: Date.now },
}, {
  timestamps: true
});

export default mongoose.model('Informe', informeSchema);
