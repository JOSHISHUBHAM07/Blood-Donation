const mongoose = require('mongoose');

const bloodStockSchema = new mongoose.Schema({
    bloodGroup: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        unique: true
    },
    unitsAvailable: {
        type: Number,
        required: true,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });


bloodStockSchema.pre('save', function () {
    this.lastUpdated = Date.now();
});

module.exports = mongoose.model('BloodStock', bloodStockSchema);
