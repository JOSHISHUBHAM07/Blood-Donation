const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['admin', 'patient', 'donor'],
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: '',
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    contact: {
        type: String,
    },
    address: {
        type: String,
    },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    lastDonationDate: {
        type: Date,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    // Enterprise fields
    isVerified: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: {
        type: Date,
    },
}, { timestamps: true });

// Index for common queries
userSchema.index({ role: 1 });
userSchema.index({ bloodGroup: 1 });
userSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('User', userSchema);
