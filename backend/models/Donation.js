const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        default: null
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    units: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    // Enterprise fields
    medicalClearance: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

donationSchema.index({ donorId: 1 });
donationSchema.index({ status: 1 });

module.exports = mongoose.model('Donation', donationSchema);
