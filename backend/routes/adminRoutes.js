const express = require('express');
const {
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
} = require('../controllers/adminController.js');
const { protect, authorize } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardData);
router.route('/stock').get(getBloodStock).put(updateBloodStock);
router.get('/requests', getAllRequests);
router.put('/requests/:id', updateRequestStatus);
router.get('/users', getUsers);
router.put('/users/:id/status', toggleUserStatus);
router.get('/audit-logs', getAuditLogs);
router.get('/donations', getAllDonations);
router.put('/donations/:id/status', updateDonationStatus);

module.exports = router;
