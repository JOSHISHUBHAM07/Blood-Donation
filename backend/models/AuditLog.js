const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'patient', 'donor'],
        required: true
    },
    actionType: {
        type: String,
        required: true,
        // e.g. 'REQUEST_STATUS_UPDATE', 'STOCK_UPDATE', 'USER_STATUS_TOGGLE'
    },
    affectedEntity: {
        type: String,
        required: true,
        // e.g. 'Request', 'BloodStock', 'User'
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    oldValue: {
        type: mongoose.Schema.Types.Mixed,
    },
    newValue: {
        type: mongoose.Schema.Types.Mixed,
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
}, { timestamps: true });

auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ affectedEntity: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
