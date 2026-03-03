import axiosInstance from '../../utils/axiosInstance';

const fetchAssignedRequests = async () => {
    const res = await axiosInstance.get('/donor/assigned-requests');
    return res.data;
};

const fetchDonationHistory = async () => {
    const res = await axiosInstance.get('/donor/donations');
    return res.data;
};

const scheduleDonation = async (data) => {
    const res = await axiosInstance.post('/donor/donations', data);
    return res.data;
};

const completeDonation = async (id) => {
    const res = await axiosInstance.put(`/donor/donations/${id}/complete`);
    return res.data;
};

const updateAvailability = async (isAvailable) => {
    const res = await axiosInstance.put('/donor/availability', { isAvailable });
    return res.data;
};

const donorService = {
    fetchAssignedRequests,
    fetchDonationHistory,
    scheduleDonation,
    completeDonation,
    updateAvailability,
};
export default donorService;
