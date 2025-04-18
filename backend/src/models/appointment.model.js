import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        doctorId: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
        patientId: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
        appointmentDate: { type: Date, required: true },
        status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
        notes: { type: String, default: "No prescription provided by doctor"}
    },
    {
        timestamps: true
    }
)

export const appointmentForPateints = mongoose.model("appointment", appointmentSchema)