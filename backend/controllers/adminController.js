const BloodStock = require('../models/BloodStock.js');
const Request = require('../models/Request.js');
const Donation = require('../models/Donation.js');
const User = require('../models/User.js');
const AuditLog = require('../models/AuditLog.js');
const logger = require('../utils/logger.js');
const { sendEmail, generateStatusUpdateEmail } = require('../utils/emailService.js');

// ─── Dashboard ───────────────────────────────────────────────────────────────
const getDashboardData = async (req, res) => {
    try {
        const [
            totalDonors,
            totalPatients,
            pendingRequests,
            approvedRequests,
            completedRequests,
            criticalRequests,
            totalRequests,
            bloodStockItems,
        ] = await Promise.all([
            User.countDocuments({ role: 'donor' }),
            User.countDocuments({ role: 'patient' }),
            Request.countDocuments({ status: 'Pending' }),
            Request.countDocuments({ status: 'Approved' }),
            Request.countDocuments({ status: 'Completed' }),
            Request.countDocuments({ emergencyLevel: 'Critical', status: { $in: ['Pending', 'Approved'] } }),
            Request.countDocuments({}),
            BloodStock.find({}),
        ]);

        let bloodStock = {};
        bloodStockItems.forEach(item => {
            bloodStock[item.bloodGroup] = item.unitsAvailable;
        });

        res.json({
            totalDonors,
            totalPatients,
            pendingRequests,
            approvedRequests,
            completedRequests,
            criticalRequests,
            totalRequests,
            bloodStock,
        });
    } catch (error) {
        logger.error(`getDashboardData error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// ─── Blood Stock ──────────────────────────────────────────────────────────────
const updateBloodStock = async (req, res) => {
    const { bloodGroup, unitsAvailable } = req.body;
    try {
        if (unitsAvailable < 0) {
            return res.status(400).json({ message: 'Units cannot be negative' });
        }
        let stock = await BloodStock.findOne({ bloodGroup });
        const oldValue = stock ? stock.unitsAvailable : 0;

        if (stock) {
            stock.unitsAvailable = unitsAvailable;
            await stock.save();
        } else {
            stock = await BloodStock.create({ bloodGroup, unitsAvailable });
        }

        await AuditLog.create({
            userId: req.user._id,
            role: req.user.role,
            actionType: 'STOCK_UPDATE',
            affectedEntity: 'BloodStock',
            entityId: stock._id,
            oldValue: { unitsAvailable: oldValue },
            newValue: { unitsAvailable },
        });

        const allStock = await BloodStock.find({});
        res.json(allStock);
    } catch (error) {
        logger.error(`updateBloodStock error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const getBloodStock = async (req, res) => {
    try {
        const stock = await BloodStock.find({});
        res.json(stock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── Requests ─────────────────────────────────────────────────────────────────
const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find({})
            .populate('patientId', 'name email contact bloodGroup')
            .populate('assignedDonorId', 'name email contact bloodGroup')
            .sort({ priorityScore: -1, createdAt: -1 });
        res.json(requests);
    } catch (error) {
        logger.error(`getAllRequests error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const updateRequestStatus = async (req, res) => {
    const { status, assignedDonorId, note } = req.body;

    try {
        const request = await Request.findById(req.params.id).populate('patientId');
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const oldStatus = request.status;

        request.status = status || request.status;
        if (assignedDonorId) request.assignedDonorId = assignedDonorId;

        // Append to approval log
        request.approvalLogs.push({
            status: request.status,
            changedBy: req.user._id,
            note: note || '',
            timestamp: new Date(),
        });

        // Auto-deduct stock on completion
        if (status === 'Completed' && oldStatus !== 'Completed') {
            const stock = await BloodStock.findOne({ bloodGroup: request.bloodGroup });
            if (stock) {
                if (stock.unitsAvailable < request.quantity) {
                    return res.status(400).json({ message: `Insufficient stock for ${request.bloodGroup}. Available: ${stock.unitsAvailable} units.` });
                }
                stock.unitsAvailable = Math.max(0, stock.unitsAvailable - request.quantity);
                await stock.save();
                logger.info(`Blood stock deducted: ${request.bloodGroup} -${request.quantity} units`);
            }
        }

        const updatedRequest = await request.save();

        // Audit log
        await AuditLog.create({
            userId: req.user._id,
            role: req.user.role,
            actionType: 'REQUEST_STATUS_UPDATE',
            affectedEntity: 'Request',
            entityId: request._id,
            oldValue: { status: oldStatus },
            newValue: { status: request.status, assignedDonorId },
            metadata: { note },
        });

        // Send status update email securely
        if (request.status !== oldStatus && request.patientId?.email) {
            sendEmail({
                email: request.patientId.email,
                ...generateStatusUpdateEmail(request.status, request.hospital, request.bloodGroup)
            });
        }

        logger.info(`Request ${request._id} status: ${oldStatus} → ${request.status} by ${req.user.email}`);
        res.json(updatedRequest);
    } catch (error) {
        logger.error(`updateRequestStatus error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// ─── Donations ────────────────────────────────────────────────────────────────
const getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find({})
            .populate('donorId', 'name email bloodGroup contact')
            .sort({ createdAt: -1 });
        res.json(donations);
    } catch (error) {
        logger.error(`getAllDonations error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const updateDonationStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        const oldStatus = donation.status;
        donation.status = status || donation.status;

        const updatedDonation = await donation.save();

        // Audit log
        await AuditLog.create({
            userId: req.user._id,
            role: req.user.role,
            actionType: 'DONATION_STATUS_UPDATE',
            affectedEntity: 'Donation',
            entityId: donation._id,
            oldValue: { status: oldStatus },
            newValue: { status: donation.status },
        });

        logger.info(`Donation ${donation._id} status: ${oldStatus} → ${donation.status} by ${req.user.email}`);
        res.json(updatedDonation);
    } catch (error) {
        logger.error(`updateDonationStatus error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// ─── Users ────────────────────────────────────────────────────────────────────
const getUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const filter = role ? { role } : { role: { $in: ['donor', 'patient'] } };
        const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        logger.error(`getUsers error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const oldStatus = user.isActive;
        user.isActive = !user.isActive;
        await user.save();

        await AuditLog.create({
            userId: req.user._id,
            role: req.user.role,
            actionType: 'USER_STATUS_TOGGLE',
            affectedEntity: 'User',
            entityId: user._id,
            oldValue: { isActive: oldStatus },
            newValue: { isActive: user.isActive },
        });

        res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, user });
    } catch (error) {
        logger.error(`toggleUserStatus error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// ─── Audit Logs ───────────────────────────────────────────────────────────────
const getAuditLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const logs = await AuditLog.find({})
            .populate('userId', 'name email role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await AuditLog.countDocuments({});
        res.json({ logs, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        logger.error(`getAuditLogs error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getDashboardData,
    updateBloodStock,
    getBloodStock,
    getAllRequests,
    updateRequestStatus,
    getUsers,
    toggleUserStatus,
    getAuditLogs,
    getAllDonations,
    updateDonationStatus
};
