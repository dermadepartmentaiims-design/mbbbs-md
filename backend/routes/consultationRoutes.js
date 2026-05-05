import express from "express";
import {
  createConsultation,
  getAllConsultations,
  respondConsultation,
  updateConsultation,
  deleteConsultation,
} from "../controllers/consultationController.js";

const router = express.Router();

// Patient
router.post("/create", createConsultation);

// Doctor/Admin
router.get("/", getAllConsultations);
router.put("/:id/respond", respondConsultation);

// Admin
router.put("/:id", updateConsultation);
router.delete("/:id", deleteConsultation);

export default router;