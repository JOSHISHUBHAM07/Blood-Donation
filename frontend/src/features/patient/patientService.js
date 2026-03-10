import axiosInstance from '../../utils/axiosInstance';

const fetchMyRequests = async () => {
    const res = await axiosInstance.get('/patient/requests');
    return res.data;
};

const createRequest = async (requestData) => {
    const res = await axiosInstance.post('/patient/requests', requestData);
    return res.data;
};

const cancelRequest = async (id) => {
    const res = await axiosInstance.delete(`/patient/requests/${id}`);
    return res.data;
};

const completeRequest = async (id) => {
    const res = await axiosInstance.put(`/patient/requests/${id}/complete`);
    return res.data;
};

const fetchBloodStock = async () => {
    const res = await axiosInstance.get('/patient/blood-availability');
    return res.data;
};

const patientService = { fetchMyRequests, createRequest, cancelRequest, completeRequest, fetchBloodStock };
export default patientService;
