const express = require('express');
const { exportBloodStock, exportUserActivity, exportRequests } = require('../controllers/exportController.js');
const { protect, authorize } = require('../middleware/authMiddleware.js');

const router = express.Router();

// All export routes must be protected and restricted to admins
router.get('/stock', protect, authorize('admin'), exportBloodStock);
router.get('/users', protect, authorize('admin'), exportUserActivity);
router.get('/requests', protect, authorize('admin'), exportRequests);

module.exports = router;
