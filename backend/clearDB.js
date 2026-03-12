require('dotenv').config();
const mongoose = require('mongoose');

const Request = require('./models/Request');
const Donation = require('./models/Donation');
const BloodStock = require('./models/BloodStock');
const AuditLog = require('./models/AuditLog');
const User = require('./models/User');

const clearDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('Connected to DB');

        await Request.deleteMany({});
        console.log('Cleared Requests');

        await Donation.deleteMany({});
        console.log('Cleared Donations');

        await BloodStock.deleteMany({});
        console.log('Cleared BloodStocks');

        await AuditLog.deleteMany({});
        console.log('Cleared AuditLogs');

        await User.deleteMany({
            email: {
                $nin: ['testa123@gmail.com', 'testd123@gmail.com', 'testp123@gmail.com']
            }
        });
        console.log('Cleared Users except test accounts');

        console.log('Successfully cleared database.');
        process.exit();
    } catch (error) {
        console.error('Error clearing DB:', error);
        process.exit(1);
    }
};

clearDB();
