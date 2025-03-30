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
        phoneNumber: {
            type: Number,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["candidate", "recruiter"],
            required: true
        },
        profile: {
            bio: { type: String },
            date_of_birth: { type: String },
            address: { type: String },
            city: { type: String },
            state: { type: String },
            country: { type: String },
            profile_picture: { type: String, default: "" },

            education: {
                degree: { type: String },
                institution: { type: String },
                year_of_passing: { type: String }
            },

            additional_certifications: [{ type: String }],

            experience: {
                company_name: { type: String },
                position: { type: String },
                duration: { type: String },
                description: { type: String }
            },

            technical_skills: [{ type: String }],
            soft_skills: [{ type: String }],
            languages_known: [{ type: String }],

            resume: { type: String },
            resumeOriginalName: { type: String },

            portfolio: { type: String },
            linkedin_profile: { type: String },
            github_profile: { type: String },

            company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" }
        }
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
