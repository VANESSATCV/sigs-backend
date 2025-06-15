import express from "express";
import {
  createPrestamo,
  getPrestamos,
  getPrestamoById,
  updatePrestamo,
  deletePrestamo,
} from "../controllers/prestamoController.js";

const router = express.Router();

router.post("/", createPrestamo);
router.get("/", getPrestamos); 
router.get("/:id", getPrestamoById);
router.put("/:id", updatePrestamo);
router.delete("/:id", deletePrestamo);

export default router;
