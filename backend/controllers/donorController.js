const Donation = require('../models/Donation.js');
const User = require('../models/User.js');
const Request = require('../models/Request.js');
const BloodStock = require('../models/BloodStock.js');
const logger = require('../utils/logger.js');

const scheduleDonation = async (req, res) => {
    const { date, location, units, requestId, medicalClearance } = req.body;

    try {
        const donation = await Donation.create({
            donorId: req.user._id,
            date,
            location,
            units: units || 1,
            requestId: requestId || null,
            medicalClearance: medicalClearance || false,
        });

        logger.info(`Donation scheduled by ${req.user.email} for ${date}`);
        res.status(201).json(donation);
    } catch (error) {
        logger.error(`scheduleDonation error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const getDonationHistory = async (req, res) => {
    try {
        const donations = await Donation.find({ donorId: req.user._id })
            .populate('requestId', 'bloodGroup hospital patientId')
            .sort({ date: -1 });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const completeDonation = async (req, res) => {
    try {
        const donation = await Donation.findOne({ _id: req.params.id, donorId: req.user._id });
        if (!donation) return res.status(404).json({ message: 'Donation not found' });
        if (donation.status === 'Completed') return res.status(400).json({ message: 'Already completed' });

        donation.status = 'Completed';
        await donation.save();

        // Update donor's lastDonationDate and availability
        await User.findByIdAndUpdate(req.user._id, {
            lastDonationDate: new Date(),
            isAvailable: false,
        });

        // Add blood units to stock
        let stock = await BloodStock.findOne({ bloodGroup: req.user.bloodGroup });
        if (stock) {
            stock.unitsAvailable += donation.units;
            await stock.save();
            logger.info(`Stock updated: ${req.user.bloodGroup} +${donation.units} units`);
        }

        logger.info(`Donation ${donation._id} completed by ${req.user.email}`);
        res.json({ message: 'Donation marked as completed', donation });
    } catch (error) {
        logger.error(`completeDonation error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const updateAvailability = async (req, res) => {
    const { isAvailable } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isAvailable = isAvailable;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            bloodGroup: updatedUser.bloodGroup,
            isAvailable: updatedUser.isAvailable,
            lastDonationDate: updatedUser.lastDonationDate,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAssignedRequests = async (req, res) => {
    try {
        const requests = await Request.find({ assignedDonorId: req.user._id })
            .populate('patientId', 'name contact email')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    scheduleDonation,
    getDonationHistory,
    completeDonation,
    updateAvailability,
    getAssignedRequests,
};
