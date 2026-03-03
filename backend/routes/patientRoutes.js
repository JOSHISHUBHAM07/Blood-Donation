const express = require('express');
const {
    createBloodRequest,
    getMyRequests,
    cancelRequest,
    getBloodAvailability,
} = require('../controllers/patientController.js');
const { protect, authorize } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.use(protect);
router.use(authorize('patient'));

router.post('/requests', createBloodRequest);
router.get('/requests', getMyRequests);
router.delete('/requests/:id', cancelRequest);
router.get('/blood-availability', getBloodAvailability);

module.exports = router;
