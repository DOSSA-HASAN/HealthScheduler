import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        doctorId: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
        patientId: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
        appointmentDate: { type: Date, required: true },
        status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
        notes: { type: String, default: "No prescription provided by doctor" }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

appointmentSchema.virtual("doctor", {
    ref: "user",
    localField: "doctorId",
    foreignField: "_id",
    justOne: true,
    options: { select: "-password" }
})

appointmentSchema.virtual("patient", {
    ref: "user",
    localField: "patientId",
    foreignField: "_id",
    justOne: true,
    options: { select: "-password" }
})

export const appointmentForPateints = mongoose.model("appointment", appointmentSchema)