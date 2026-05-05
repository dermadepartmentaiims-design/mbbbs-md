import Consultation from "../models/Consultation.js";

// CREATE consultation (patient)
export const createConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.create(req.body);
    res.status(201).json(consultation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all consultations (doctor/admin)
export const getAllConsultations = async (req, res) => {
  try {
    const data = await Consultation.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DOCTOR RESPONSE
export const respondConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Consultation.findByIdAndUpdate(
      id,
      {
        doctorComments: req.body.doctorComments,
        prescription: req.body.prescription,
        recommendedTests: req.body.recommendedTests,
        status: "completed",
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE consultation (admin)
export const updateConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Consultation.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE consultation (admin)
export const deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Consultation.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    res.json({ message: "Consultation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};