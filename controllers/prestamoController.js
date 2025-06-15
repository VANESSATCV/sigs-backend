// backend/controllers/prestamoController.js
import Prestamo from "../models/Prestamo.js";
import Product from "../models/Product.js";

// Crear un nuevo préstamo
export const createPrestamo = async (req, res) => {
  try {
    const {
      nombreAprendiz,
      apellidosAprendiz,
      ficha,
      producto,
      cantidad,
      fechaPrestamo,
      devuelto,
      estadoEntrega,
      comentarios,
      fechaDevolucion,
    } = req.body;

    // Opcional: validar que el producto exista y haya stock suficiente
    const productDoc = await Product.findById(producto);
    if (!productDoc) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    if (cantidad > productDoc.cantidad) {
      return res.status(400).json({ message: "Cantidad excede el stock disponible" });
    }

    // Reducir stock del producto (si se desea)
    productDoc.cantidad -= cantidad;
    await productDoc.save();

    const nuevoPrestamo = new Prestamo({
      nombreAprendiz,
      apellidosAprendiz,
      ficha,
      producto,
      cantidad,
      fechaPrestamo: fechaPrestamo || Date.now(),
      devuelto: devuelto || "no",
      estadoEntrega: estadoEntrega || "Buen estado",
      comentarios: comentarios || "",
      fechaDevolucion,
    });

    const prestamoGuardado = await nuevoPrestamo.save();
    res.status(201).json(prestamoGuardado);
  } catch (error) {
    console.error("Error creando préstamo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener todos los préstamos
export const getPrestamos = async (req, res) => {
  try {
    const prestamos = await Prestamo.find()
      .populate("producto", "nombre categoria") // solo campos necesarios
      .sort({ createdAt: -1 });
    res.json(prestamos);
  } catch (error) {
    console.error("Error obteniendo préstamos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener un préstamo por su ID
export const getPrestamoById = async (req, res) => {
  try {
    const { id } = req.params;
    const prestamo = await Prestamo.findById(id).populate("producto", "nombre categoria");
    if (!prestamo) {
      return res.status(404).json({ message: "Préstamo no encontrado" });
    }
    res.json(prestamo);
  } catch (error) {
    console.error("Error obteniendo préstamo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Actualizar datos de un préstamo
export const updatePrestamo = async (req, res) => {
  try {
    const { id } = req.params;
    const prestamoExistente = await Prestamo.findById(id);
    if (!prestamoExistente) {
      return res.status(404).json({ message: "Préstamo no encontrado" });
    }

    // Si cambias devuelto a "si", actualiza stock de producto, etc.
    const datosActualizados = req.body;
    if (datosActualizados.devuelto === "si" && prestamoExistente.devuelto === "no") {
      // Si recién se marcó como devuelto, reingresamos stock
      const productDoc = await Product.findById(prestamoExistente.producto);
      if (productDoc) {
        productDoc.cantidad += prestamoExistente.cantidad;
        await productDoc.save();
      }
    }

    Object.assign(prestamoExistente, datosActualizados);
    const prestamoActualizado = await prestamoExistente.save();
    res.json(prestamoActualizado);
  } catch (error) {
    console.error("Error actualizando préstamo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Eliminar un préstamo
export const deletePrestamo = async (req, res) => {
  try {
    const { id } = req.params;
    const prestamo = await Prestamo.findById(id);
    if (!prestamo) {
      return res.status(404).json({ message: "Préstamo no encontrado" });
    }

    // Validar devuelto de forma más robusta
    const noDevuelto = String(prestamo.devuelto).toLowerCase() === "no";
    if (noDevuelto) {
      const productDoc = await Product.findById(prestamo.producto);
      if (productDoc) {
        productDoc.cantidad += prestamo.cantidad;
        await productDoc.save();
      }
    }

    await prestamo.deleteOne(); // mejor práctica que remove()
    res.json({ message: "Préstamo eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando préstamo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
