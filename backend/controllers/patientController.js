const Request = require('../models/Request.js');
const BloodStock = require('../models/BloodStock.js');
const User = require('../models/User.js');
const logger = require('../utils/logger.js');
const { sendEmail, generateUrgentRequestEmail } = require('../utils/emailService.js');

// Priority Score Engine
// Emergency Level: Critical=40, High=30, Medium=20, Low=10
// Urgency (days until required): <1d=30, <3d=20, <7d=10, else=0
// Blood stock: 0 units=20, <5=10, else=0
const computePriorityScore = async (emergencyLevel, requiredDate, bloodGroup) => {
    let score = 0;

    // Emergency weight
    const emergencyWeights = { Critical: 40, High: 30, Medium: 20, Low: 10 };
    score += emergencyWeights[emergencyLevel] || 10;

    // Urgency weight
    const daysUntilRequired = Math.ceil((new Date(requiredDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntilRequired <= 1) score += 30;
    else if (daysUntilRequired <= 3) score += 20;
    else if (daysUntilRequired <= 7) score += 10;

    // Stock scarcity
    const stock = await BloodStock.findOne({ bloodGroup });
    const units = stock ? stock.unitsAvailable : 0;
    if (units === 0) score += 20;
    else if (units < 5) score += 10;

    return score;
};

const createBloodRequest = async (req, res) => {
    const { bloodGroup, quantity, hospital, requiredDate, emergencyLevel, contactDetails, medicalReason } = req.body;

    try {
        const priorityScore = await computePriorityScore(emergencyLevel, requiredDate, bloodGroup);

        const request = await Request.create({
            patientId: req.user._id,
            bloodGroup,
            quantity,
            hospital,
            requiredDate,
            emergencyLevel,
            contactDetails,
            medicalReason,
            priorityScore,
        });

        logger.info(`Blood request created by ${req.user.email}: ${bloodGroup} (priority: ${priorityScore})`);

        // Asynchronously notify matching donors if request is urgent
        if (['High', 'Critical'].includes(emergencyLevel)) {
            const donors = await User.find({ role: 'donor', bloodGroup, isActive: true });
            donors.forEach(donor => {
                // Ensure we don't block the request if emails fail
                sendEmail({
                    email: donor.email,
                    ...generateUrgentRequestEmail(hospital, bloodGroup, quantity, req.user.name || 'A patient')
                });
            });
        }

        res.status(201).json(request);
    } catch (error) {
        logger.error(`createBloodRequest error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const getMyRequests = async (req, res) => {
    try {
        const requests = await Request.find({ patientId: req.user._id })
            .populate('assignedDonorId', 'name contact bloodGroup')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelRequest = async (req, res) => {
    try {
        const request = await Request.findOne({ _id: req.params.id, patientId: req.user._id });
        if (!request) {
            return res.status(404).json({ message: 'Request not found or unauthorised' });
        }
        if (!['Pending'].includes(request.status)) {
            return res.status(400).json({ message: `Cannot cancel a request with status: ${request.status}` });
        }
        request.status = 'Cancelled';
        request.approvalLogs.push({
            status: 'Cancelled',
            changedBy: req.user._id,
            note: 'Cancelled by patient',
            timestamp: new Date(),
        });
        await request.save();
        res.json({ message: 'Request cancelled', request });
    } catch (error) {
        logger.error(`cancelRequest error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const completeRequest = async (req, res) => {
    try {
        const request = await Request.findOne({ _id: req.params.id, patientId: req.user._id });
        if (!request) {
            return res.status(404).json({ message: 'Request not found or unauthorised' });
        }
        if (!['Approved', 'Donor Assigned'].includes(request.status)) {
            return res.status(400).json({ message: `Cannot complete a request with status: ${request.status}` });
        }

        const oldStatus = request.status;
        request.status = 'Completed';
        request.approvalLogs.push({
            status: 'Completed',
            changedBy: req.user._id,
            note: 'Marked as completed by patient',
            timestamp: new Date(),
        });

        // Deduct stock if it was Approved (from blood bank)
        // If it was Donor Assigned, it's assumed the donor gave blood directly or to the bank, stock handling depends on donor flow, but to mirror admin we deduct if possible
        if (oldStatus !== 'Completed') {
            const stock = await BloodStock.findOne({ bloodGroup: request.bloodGroup });
            if (stock && oldStatus === 'Approved') {
                if (stock.unitsAvailable < request.quantity) {
                    return res.status(400).json({ message: `Insufficient stock for ${request.bloodGroup}. Available: ${stock.unitsAvailable} units.` });
                }
                stock.unitsAvailable = Math.max(0, stock.unitsAvailable - request.quantity);
                await stock.save();
                logger.info(`Blood stock deducted on patient complete: ${request.bloodGroup} -${request.quantity} units`);
            }
        }

        await request.save();
        res.json({ message: 'Request completed successfully', request });
    } catch (error) {
        logger.error(`completeRequest error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const getBloodAvailability = async (req, res) => {
    try {
        const stock = await BloodStock.find({});
        res.json(stock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBloodRequest,
    getMyRequests,
    cancelRequest,
    completeRequest,
    getBloodAvailability
};
