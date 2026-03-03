const BloodStock = require('../models/BloodStock.js');
const User = require('../models/User.js');
const Request = require('../models/Request.js');

const exportBloodStock = async (req, res) => {
    try {
        const stock = await BloodStock.find({});
        let csv = 'Blood Group,Units Available,Last Updated\n';
        stock.forEach(item => {
            csv += `"${item.bloodGroup}","${item.unitsAvailable}","${item.updatedAt.toISOString()}"\n`;
        });
        res.header('Content-Type', 'text/csv');
        res.attachment('blood_stock_report.csv');
        return res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const exportUserActivity = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        let csv = 'Name,Email,Role,Blood Group,Status,Registered At\n';
        users.forEach(user => {
            csv += `"${user.name || ''}","${user.email || ''}","${user.role || ''}","${user.bloodGroup || ''}","${user.isActive ? 'Active' : 'Inactive'}","${user.createdAt.toISOString()}"\n`;
        });
        res.header('Content-Type', 'text/csv');
        res.attachment('user_activity_report.csv');
        return res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const exportRequests = async (req, res) => {
    try {
        const requests = await Request.find({}).populate('patientId', 'name').populate('assignedDonorId', 'name');
        let csv = 'Hospital,Blood Group,Units,Required Date,Emergency Level,Status,Patient Name,Assigned Donor\n';
        requests.forEach(reqObj => {
            csv += `"${reqObj.hospital || ''}","${reqObj.bloodGroup || ''}","${reqObj.quantity || ''}","${new Date(reqObj.requiredDate).toISOString()}","${reqObj.emergencyLevel || ''}","${reqObj.status || ''}","${reqObj.patientId?.name || ''}","${reqObj.assignedDonorId?.name || ''}"\n`;
        });
        res.header('Content-Type', 'text/csv');
        res.attachment('blood_requests_report.csv');
        return res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    exportBloodStock,
    exportUserActivity,
    exportRequests
};
