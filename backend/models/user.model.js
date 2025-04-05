import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        phoneNumber: {
            type: Number,
            required: true
        },
        password: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        skills: {
            type: [String],
            required: true
        },
        
        role: {
            type: String,
            enum: ["candidate", "recruiter"],
            required: true
        },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
