// backend/models/Prestamo.js
import mongoose from "mongoose";

const prestamoSchema = new mongoose.Schema(
  {
    nombreAprendiz: { type: String, required: true },
    apellidosAprendiz: { type: String, required: true },
    ficha: { type: Number, required: true },
    // Referencia al producto (ObjectId de la colección "Product")
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    cantidad: { type: Number, required: true },
    fechaPrestamo: { type: Date, required: true, default: Date.now },
    devuelto: {
      type: String,
      enum: ["si", "no"],
      default: "no",
    },
    estadoEntrega: {
      type: String,
      enum: ["Buen estado", "Regular", "Malo"],
      default: "Buen estado",
    },
    comentarios: { type: String, default: "" },
    fechaDevolucion: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Prestamo", prestamoSchema);
