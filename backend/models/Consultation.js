import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    // Patient Info
    patientName: { type: String, required: true },
    age: Number,
    gender: String,
    email: String,

    // Clinical Info
    chiefComplaint: { type: String, required: true },
    symptoms: String,
    duration: String,
    pastHistory: String,
    medications: String,

    // Reports
    reports: [String], // URLs (Cloudinary later)

    // Doctor Response
    doctorComments: String,
    prescription: String,
    recommendedTests: String,

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Consultation", consultationSchema);