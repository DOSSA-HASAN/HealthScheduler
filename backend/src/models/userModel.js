import mongoose, { Types } from "mongoose"

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: { type: String, enum: ["user", "admin", "doctor"], default: "user" },
        passwordResetOtp: { type: String, default: "" },
        profilePic: { type: String, default: "" },
        passwordOtpExpiryDate: { type: Date, default: null },
        emailResetOtp: { type: String, default: "" },
        emailOtpExpiryDate: { type: Date, default: null },
        specialization: { type: String, default: "General" },
        experience: { type: Number, default: 1 }
    },
    {
        timestamps: true
    }
)

UserSchema.pre("save", function (next) {
    if (this.role === "doctor") {
        if (!this.experience || !this.specialization) {
            return next(new Error("Specialization and experience are required for doctors."))
        }
        if (typeof this.experience !== "number" || this.experience <= 0) {
            return next(new Error("Experience must be a positive number for doctors."))
        }
    } else {
        if (this.experience || this.specialization) {
            return next(new Error("Only doctors are allowed to have specialization and experience."));
        }
    }
    next()
})

export const userModel = mongoose.model("user", UserSchema)