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
        specialization: {
            type: String,
            validate: {
                validator: function (value) {
                    if(this.role === "doctor") return !!value

                    return value === undefined || value === null
                },
                message: function (props) {
                    return this.role === "doctor" ? "Specialization is required for doctors." : "Specialization is only allowed for doctors."
                }
            }
        },
        experience: {
            type: Number,
            validate: {
                validator: function (value) {
                    if(this.role === "doctor") return typeof value === "number" && value > 0

                    return value === undefined || value === null
                },
                message: function (props) {
                    return this.role === "doctor" ? "Experience is required for doctors." : "Experience is only allowed for doctors."
                }
            }
        }
    },
    {
        timestamps: true
    }
)

export const userModel = mongoose.model("user", UserSchema)