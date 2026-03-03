import axiosInstance from '../../utils/axiosInstance';

const fetchDashboard = async () => {
    const res = await axiosInstance.get('/admin/dashboard');
    return res.data;
};

const fetchRequests = async () => {
    const res = await axiosInstance.get('/admin/requests');
    return res.data;
};

const updateRequestStatus = async ({ id, status, assignedDonorId, note }) => {
    const res = await axiosInstance.put(`/admin/requests/${id}`, { status, assignedDonorId, note });
    return res.data;
};

const fetchStock = async () => {
    const res = await axiosInstance.get('/admin/stock');
    return res.data;
};

const updateStock = async (data) => {
    const res = await axiosInstance.put('/admin/stock', data);
    return res.data;
};

const fetchUsers = async (role) => {
    const res = await axiosInstance.get('/admin/users', { params: role ? { role } : {} });
    return res.data;
};

const toggleUserStatus = async (id) => {
    const res = await axiosInstance.put(`/admin/users/${id}/status`);
    return res.data;
};

const fetchAuditLogs = async (page = 1) => {
    const res = await axiosInstance.get('/admin/audit-logs', { params: { page } });
    return res.data;
};

const adminService = {
    fetchDashboard,
    fetchRequests,
    updateRequestStatus,
    fetchStock,
    updateStock,
    fetchUsers,
    toggleUserStatus,
    fetchAuditLogs,
};
export default adminService;
