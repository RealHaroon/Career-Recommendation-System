const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profile: {
            gender:             { type: String, default: "" },
            ug_course:          { type: String, default: "" },
            ug_specialization:  { type: String, default: "" },
            interests:          { type: String, default: "" },
            skills:             { type: String, default: "" },
            cgpa:               { type: Number, default: 0 },
            has_certification:  { type: String, default: "No" },
            certification_title:{ type: String, default: "None" },
            is_working:         { type: String, default: "No" },
            masters_field:      { type: String, default: "No Masters" },
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model("User", userSchema);