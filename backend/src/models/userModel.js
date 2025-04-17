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
        emailOtpExpiryDate: { type: Date, default: null }
    },
    {
        timestamps: true
    }
)

export const userModel = mongoose.model("user", UserSchema)