const express = require('express');
const {
    scheduleDonation,
    getDonationHistory,
    completeDonation,
    updateAvailability,
    getAssignedRequests,
} = require('../controllers/donorController.js');
const { protect, authorize } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.use(protect);
router.use(authorize('donor'));

router.post('/donations', scheduleDonation);
router.get('/donations', getDonationHistory);
router.put('/donations/:id/complete', completeDonation);
router.put('/availability', updateAvailability);
router.get('/assigned-requests', getAssignedRequests);

module.exports = router;
