const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const AuditLog = require('../models/AuditLog.js');
const logger = require('../utils/logger.js');
const { sendEmail, generateWelcomeEmail } = require('../utils/emailService.js');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { name, email, password, role, bloodGroup, contact, address } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            bloodGroup,
            contact,
            address,
            isVerified: false,
            isActive: true,
        });

        if (user) {
            logger.info(`New user registered: ${user.email} (${user.role})`);

            // Send Welcome Email asynchronously
            sendEmail({
                email: user.email,
                ...generateWelcomeEmail(user.name)
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                bloodGroup: user.bloodGroup,
                isVerified: user.isVerified,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        logger.error(`Register error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Your account has been deactivated. Contact admin.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Update lastLogin
        user.lastLogin = new Date();
        await user.save();

        logger.info(`User logged in: ${user.email}`);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            bloodGroup: user.bloodGroup,
            contact: user.contact,
            address: user.address,
            isAvailable: user.isAvailable,
            lastDonationDate: user.lastDonationDate,
            isVerified: user.isVerified,
            token: generateToken(user._id),
        });
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.contact = req.body.contact || user.contact;
            user.address = req.body.address || user.address;
            user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
            if (req.body.isAvailable !== undefined) {
                user.isAvailable = req.body.isAvailable;
            }

            if (req.body.password) {
                const bcrypt = require('bcryptjs');
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                bloodGroup: updatedUser.bloodGroup,
                contact: updatedUser.contact,
                address: updatedUser.address,
                isAvailable: updatedUser.isAvailable,
                lastDonationDate: updatedUser.lastDonationDate,
                isVerified: updatedUser.isVerified,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
};
