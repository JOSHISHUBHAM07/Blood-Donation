const mongoose = require('mongoose');

const approvalLogSchema = new mongoose.Schema({
    status: { type: String },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
}, { _id: false });

const requestSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bloodGroup: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    hospital: {
        type: String,
        required: true
    },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Donor Assigned', 'Completed', 'Rejected', 'Cancelled'],
        default: 'Pending'
    },
    assignedDonorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    requiredDate: {
        type: Date,
        required: true
    },
    emergencyLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'High'
    },
    contactDetails: {
        type: String,
        required: true
    },
    medicalReason: {
        type: String
    },
    
    priorityScore: {
        type: Number,
        default: 0
    },
    approvalLogs: [approvalLogSchema],
}, { timestamps: true });


requestSchema.index({ bloodGroup: 1 });
requestSchema.index({ status: 1 });
requestSchema.index({ createdAt: -1 });
requestSchema.index({ priorityScore: -1 });
requestSchema.index({ patientId: 1 });

module.exports = mongoose.model('Request', requestSchema);
