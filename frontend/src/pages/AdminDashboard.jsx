import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
    LayoutDashboard, Users, Droplet, Activity, AlertTriangle,
    CheckCircle, Clock, Shield, ClipboardList, Loader2,
    X, RefreshCw, TrendingUp,
    Download, ChevronLeft, ChevronRight, Heart
} from 'lucide-react';
import {
    fetchDashboard, fetchRequests, updateRequestStatus,
    fetchStock, updateStock, fetchUsers, toggleUserStatus,
    fetchAuditLogs, fetchDonations, updateDonationStatus, resetAdmin
} from '../features/admin/adminSlice';
import SkeletonLoader from '../components/SkeletonLoader';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const PIE_COLORS = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#a78bfa', '#f472b6', '#34d399'];



const statusColors = {
    Pending: 'bg-amber-100 text-amber-700',
    Approved: 'bg-blue-100 text-blue-700',
    'Donor Assigned': 'bg-purple-100 text-purple-700',
    Scheduled: 'bg-blue-100 text-blue-700',
    Completed: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-700',
    Cancelled: 'bg-gray-100 text-gray-600',
};

const emergencyColors = {
    Low: 'text-green-600 bg-green-50',
    Medium: 'text-yellow-600 bg-yellow-50',
    High: 'text-orange-600 bg-orange-50',
    Critical: 'text-red-600 bg-red-50',
};

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }),
};



export default function AdminDashboard() {
    const dispatch = useDispatch();
    const { user } = useSelector(s => s.auth);
    const { dashboard, requests, donations, stock, users, auditLogs, isLoading, isError, isSuccess, message } = useSelector(s => s.admin);

    const [activeTab, setActiveTab] = useState('dashboard');
    const [editStock, setEditStock] = useState({});
    const [statusModal, setStatusModal] = useState(null); 
    const [newStatus, setNewStatus] = useState('');
    const [statusNote, setStatusNote] = useState('');
    const [donorIdInput, setDonorIdInput] = useState('');
    const [requestsPage, setRequestsPage] = useState(1);
    const [donationsPage, setDonationsPage] = useState(1);
    const [usersPage, setUsersPage] = useState(1);
    const itemsPerPage = 8;

    const downloadCSV = async (type) => {
        try {
            const toastId = toast.loading('Generating export...');
            const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://blood-donation-li9h.onrender.com/api');
            const res = await axios.get(`${BASE_URL}/export/${type}`, {
                headers: { Authorization: `Bearer ${user.token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}_report.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Export completed successfully', { id: toastId });
        } catch {
            toast.error('Failed to export data');
        }
    };

    useEffect(() => {
        dispatch(fetchDashboard());
        dispatch(fetchRequests());
        dispatch(fetchStock());
    }, [dispatch]);

    useEffect(() => {
        if (activeTab === 'users') dispatch(fetchUsers());
        if (activeTab === 'audit') dispatch(fetchAuditLogs(1));
        if (activeTab === 'donations') dispatch(fetchDonations());
    }, [activeTab, dispatch]);

    useEffect(() => {
        if (isError) { toast.error(message); dispatch(resetAdmin()); }
        if (isSuccess) {
            dispatch(resetAdmin());
            dispatch(fetchDashboard());
            if (activeTab === 'requests') dispatch(fetchRequests());
            if (activeTab === 'donations') dispatch(fetchDonations());
            if (activeTab === 'stock') dispatch(fetchStock());
        }
    }, [isError, isSuccess, message, activeTab, dispatch]);

    const handleUpdateStatus = () => {
        if (!newStatus) { toast.error('Select a status'); return; }

        if (statusModal.type === 'donation') {
            dispatch(updateDonationStatus({ id: statusModal.requestId, status: newStatus }))
                .then(res => {
                    if (!res.error) {
                        toast.success(`Donation status updated to ${newStatus}`);
                        dispatch(fetchDonations());
                        dispatch(fetchDashboard());
                        setStatusModal(null);
                    } else toast.error(res.payload);
                });
        } else {
            dispatch(updateRequestStatus({ id: statusModal.requestId, status: newStatus, note: statusNote, assignedDonorId: donorIdInput || undefined }))
                .then(res => {
                    if (!res.error) {
                        toast.success(`Request status updated to ${newStatus}`);
                        dispatch(fetchRequests());
                        dispatch(fetchDashboard());
                        setStatusModal(null);
                    } else toast.error(res.payload);
                });
        }
    };

    const handleMarkComplete = (id, type) => {
        if (type === 'donation') {
            dispatch(updateDonationStatus({ id, status: 'Completed' }))
                .then(res => {
                    if (!res.error) {
                        toast.success('Donation marked as completed');
                        dispatch(fetchDonations());
                        dispatch(fetchDashboard());
                    } else toast.error(res.payload);
                });
        } else {
            dispatch(updateRequestStatus({ id, status: 'Completed' }))
                .then(res => {
                    if (!res.error) {
                        toast.success('Request marked as completed');
                        dispatch(fetchRequests());
                        dispatch(fetchDashboard());
                    } else toast.error(res.payload);
                });
        }
    };

    const handleUpdateStock = (bg) => {
        const val = parseInt(editStock[bg]);
        if (isNaN(val) || val < 0) { toast.error('Enter a valid number'); return; }
        dispatch(updateStock({ bloodGroup: bg, unitsAvailable: val })).then(res => {
            if (!res.error) { toast.success(`${bg} stock updated`); dispatch(fetchDashboard()); }
        });
    };

    const handleToggleUser = (id) => {
        dispatch(toggleUserStatus(id)).then(res => {
            if (!res.error) toast.success('User status updated');
        });
    };

    const pieData = BLOOD_GROUPS.map(bg => ({
        name: bg,
        value: dashboard?.bloodStock?.[bg] || 0,
    })).filter(d => d.value > 0);

    const statCards = dashboard ? [
        { label: 'Total Donors', value: dashboard.totalDonors, icon: Users, color: 'from-blue-500 to-blue-600' },
        { label: 'Total Patients', value: dashboard.totalPatients, icon: Activity, color: 'from-purple-500 to-purple-600' },
        { label: 'Pending Requests', value: dashboard.pendingRequests, icon: Clock, color: 'from-amber-400 to-amber-500' },
        { label: 'Critical Cases', value: dashboard.criticalRequests, icon: AlertTriangle, color: 'from-red-500 to-red-600' },
        { label: 'Approved', value: dashboard.approvedRequests, icon: CheckCircle, color: 'from-emerald-500 to-emerald-600' },
        { label: 'Completed', value: dashboard.completedRequests, icon: TrendingUp, color: 'from-teal-500 to-teal-600' },
    ] : [];

    const sortedRequests = [...(requests || [])]
        .filter(r => !['Completed', 'Cancelled', 'Rejected'].includes(r.status))
        .sort(() => 0);

    const sortedDonations = [...(donations || [])]
        .filter(d => !['Completed', 'Cancelled', 'Rejected'].includes(d.status))
        .sort(() => 0);

    const paginatedRequests = sortedRequests.slice((requestsPage - 1) * itemsPerPage, requestsPage * itemsPerPage);
    const totalRequestPages = Math.max(1, Math.ceil(sortedRequests.length / itemsPerPage));

    const paginatedDonations = sortedDonations.slice((donationsPage - 1) * itemsPerPage, donationsPage * itemsPerPage);
    const totalDonationPages = Math.max(1, Math.ceil(sortedDonations.length / itemsPerPage));

    const paginatedUsers = users?.slice((usersPage - 1) * itemsPerPage, usersPage * itemsPerPage) || [];
    const totalUserPages = Math.max(1, Math.ceil((users?.length || 0) / itemsPerPage));

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-7xl mx-auto">
            {}
            <motion.div variants={cardVariants} custom={0} initial="hidden" animate="show" className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-500 text-sm">System overview · Logged in as <span className="font-semibold text-violet-600">{user?.name}</span></p>
                    </div>
                </div>
            </motion.div>

            {}
            <div className="flex overflow-x-auto gap-2 mb-6 scrollbar-hide pb-1">
                <div className="flex gap-2 bg-gray-100 p-1 rounded-xl flex-shrink-0 min-w-fit">
                {[
                    { key: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
                    { key: 'requests', icon: ClipboardList, label: 'Requests' },
                    { key: 'donations', icon: Heart, label: 'Donations' },
                    { key: 'stock', icon: Droplet, label: 'Blood Stock' },
                    { key: 'users', icon: Users, label: 'Users' },
                    { key: 'audit', icon: Shield, label: 'Audit Logs' },
                ].map(({ key, icon: Icon, label }) => (
                    <button key={key} onClick={() => setActiveTab(key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === key ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        <Icon className="w-4 h-4" />{label}
                    </button>
                ))}
                </div>
            </div>

            {}
            {activeTab === 'dashboard' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        {statCards.map((s, i) => (
                            <motion.div key={i} variants={cardVariants} custom={i} initial="hidden" animate="show"
                                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow`}>
                                    <s.icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-2xl font-extrabold text-gray-900">{s.value ?? '—'}</div>
                                <div className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Blood Stock Distribution</h2>
                        {pieData.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">No blood stock data yet. Add stock from the Blood Stock tab.</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                                        {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [`${value} units`, name]} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>
            )}

            {}
            {activeTab === 'requests' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                        <h2 className="text-lg font-bold text-gray-800">Active Blood Requests <span className="text-gray-400 font-normal text-sm">({sortedRequests.length})</span></h2>
                        <div className="flex items-center gap-3">
                            <button onClick={() => downloadCSV('requests')} className="flex items-center gap-1.5 text-sm bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors font-semibold">
                                <Download className="w-4 h-4" /> Export CSV
                            </button>
                            <button onClick={() => dispatch(fetchRequests())} className="flex items-center gap-1.5 text-sm bg-gray-50 text-gray-500 hover:text-violet-600 px-3 py-1.5 rounded-lg transition-colors font-medium">
                                <RefreshCw className="w-4 h-4" /> Refresh
                            </button>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="mt-4"><SkeletonLoader type="card" count={3} /></div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">No requests found</div>
                    ) : (
                        <div className="space-y-3">
                            {paginatedRequests.map((req, i) => (
                                <motion.div key={req._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                                    className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white font-extrabold text-base shadow">
                                                {req.bloodGroup}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 text-sm">{req.hospital}</div>
                                                <div className="text-xs text-gray-500">{req.patientId?.name} · {req.quantity} unit(s) · {new Date(req.requiredDate).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${emergencyColors[req.emergencyLevel]}`}>{req.emergencyLevel}</span>
                                            <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${statusColors[req.status] || 'bg-gray-100 text-gray-600'}`}>{req.status}</span>
                                            {req.priorityScore > 0 && (
                                                <span className={`px-2 py-0.5 rounded-lg text-xs font-extrabold ${req.priorityScore >= 70 ? 'bg-red-500 text-white' : req.priorityScore >= 50 ? 'bg-orange-400 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                                    P:{req.priorityScore}
                                                </span>
                                            )}
                                            {req.status === 'Approved' && (
                                                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                                    onClick={() => handleMarkComplete(req._id, 'request')}
                                                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm ml-1 flex items-center gap-1">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Mark Complete
                                                </motion.button>
                                            )}
                                            {req.status !== 'Completed' && !['Cancelled', 'Rejected'].includes(req.status) && (
                                                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                                    onClick={() => { setStatusModal({ requestId: req._id, currentStatus: req.status, type: 'request' }); setNewStatus('Approved'); setStatusNote(''); setDonorIdInput(''); }}
                                                    className="px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-bold hover:bg-violet-700 transition-colors shadow-sm ml-1">
                                                    Update
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {}
                            {requests.length > itemsPerPage && (
                                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-gray-100 mt-4">
                                    <button disabled={requestsPage === 1} onClick={() => setRequestsPage(p => p - 1)} className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50">
                                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <span className="text-sm font-medium text-gray-600">Page {requestsPage} of {totalRequestPages}</span>
                                    <button disabled={requestsPage === totalRequestPages} onClick={() => setRequestsPage(p => p + 1)} className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50">
                                        <ChevronRight className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            )}

            {}
            {activeTab === 'donations' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                        <h2 className="text-lg font-bold text-gray-800">Active Donor Donations <span className="text-gray-400 font-normal text-sm">({sortedDonations.length})</span></h2>
                        <div className="flex items-center gap-3">
                            <button onClick={() => downloadCSV('donations')} className="flex items-center gap-1.5 text-sm bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors font-semibold">
                                <Download className="w-4 h-4" /> Export CSV
                            </button>
                            <button onClick={() => dispatch(fetchDonations())} className="flex items-center gap-1.5 text-sm bg-gray-50 text-gray-500 hover:text-violet-600 px-3 py-1.5 rounded-lg transition-colors font-medium">
                                <RefreshCw className="w-4 h-4" /> Refresh
                            </button>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="mt-4"><SkeletonLoader type="card" count={3} /></div>
                    ) : donations.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">No donations found</div>
                    ) : (
                        <div className="space-y-3">
                            {paginatedDonations.map((don, i) => (
                                <motion.div key={don._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                                    className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white font-extrabold text-base shadow">
                                                {don.donorId?.bloodGroup || '—'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 text-sm">{don.location}</div>
                                                <div className="text-xs text-gray-500">{don.donorId?.name} · {don.units} unit(s) · {new Date(don.date).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${statusColors[don.status] || 'bg-gray-100 text-gray-600'}`}>{don.status}</span>
                                            {don.status === 'Approved' && (
                                                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                                    onClick={() => handleMarkComplete(don._id, 'donation')}
                                                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm ml-1 flex items-center gap-1">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Mark Complete
                                                </motion.button>
                                            )}
                                            {don.status !== 'Completed' && !['Cancelled', 'Rejected'].includes(don.status) && (
                                                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                                    onClick={() => { setStatusModal({ requestId: don._id, currentStatus: don.status, type: 'donation' }); setNewStatus('Approved'); }}
                                                    className="px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-bold hover:bg-violet-700 transition-colors shadow-sm ml-1">
                                                    Update
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {}
                            {donations.length > itemsPerPage && (
                                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-gray-100 mt-4">
                                    <button disabled={donationsPage === 1} onClick={() => setDonationsPage(p => p - 1)} className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50">
                                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <span className="text-sm font-medium text-gray-600">Page {donationsPage} of {totalDonationPages}</span>
                                    <button disabled={donationsPage === totalDonationPages} onClick={() => setDonationsPage(p => p + 1)} className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50">
                                        <ChevronRight className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            )}

            {}
            {activeTab === 'stock' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Blood Stock Management</h2>
                        <button onClick={() => downloadCSV('stock')} className="flex items-center gap-1.5 text-sm bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors font-semibold">
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {BLOOD_GROUPS.map(bg => {
                            const item = stock.find(s => s.bloodGroup === bg);
                            const units = item ? item.unitsAvailable : 0;
                            const level = units === 0 ? 'empty' : units < 5 ? 'low' : 'ok';
                            return (
                                <motion.div key={bg} whileHover={{ y: -2 }} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
                                    <div className={`text-2xl font-extrabold mb-1 ${level === 'empty' ? 'text-red-500' : level === 'low' ? 'text-amber-500' : 'text-emerald-600'}`}>{bg}</div>
                                    <div className="text-3xl font-black text-gray-900 mb-3">{units}</div>
                                    <div className="flex gap-2">
                                        <input type="number" min="0" placeholder={String(units)}
                                            value={editStock[bg] ?? ''}
                                            onChange={e => setEditStock(prev => ({ ...prev, [bg]: e.target.value }))}
                                            className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-violet-300 outline-none" />
                                        <motion.button whileTap={{ scale: 0.95 }}
                                            onClick={() => handleUpdateStock(bg)}
                                            className="px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-bold hover:bg-violet-700 transition-colors">
                                            Set
                                        </motion.button>
                                    </div>
                                    <div className={`mt-2 text-xs font-bold uppercase ${level === 'empty' ? 'text-red-500' : level === 'low' ? 'text-amber-500' : 'text-emerald-600'}`}>
                                        {level === 'empty' ? '⚠ Out of Stock' : level === 'low' ? '⚡ Low Stock' : '✓ Adequate'}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {}
            {activeTab === 'users' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800">User Management <span className="text-gray-400 font-normal text-sm">({users.length})</span></h2>
                        <div className="flex items-center gap-3">
                            <button onClick={() => dispatch(fetchUsers())} className="flex items-center gap-1.5 text-sm bg-gray-50 text-gray-500 hover:text-violet-600 px-3 py-1.5 rounded-lg transition-colors font-medium">
                                <RefreshCw className="w-4 h-4" /> Refresh
                            </button>
                            <button onClick={() => downloadCSV('users')} className="flex items-center gap-1.5 text-sm bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors font-semibold">
                                <Download className="w-4 h-4" /> Export CSV
                            </button>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="mt-4"><SkeletonLoader type="table" count={5} /></div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            {['Name', 'Email', 'Role', 'Blood Group', 'Available', 'Last Login', 'Status', 'Action'].map(h => (
                                                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {paginatedUsers.map((u, i) => (
                                            <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                                className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 font-semibold text-gray-800">{u.name}</td>
                                                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.role === 'donor' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span>
                                                </td>
                                                <td className="px-4 py-3 font-bold text-gray-700">{u.bloodGroup || '—'}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                                        {u.role === 'donor' ? (u.isAvailable ? '✓ Available' : '✗ Unavailable') : '—'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-400 text-xs">{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                                        {u.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <motion.button whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleToggleUser(u._id)}
                                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                                                        {u.isActive ? 'Deactivate' : 'Activate'}
                                                    </motion.button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {}
                            {users.length > itemsPerPage && (
                                <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 bg-gray-50">
                                    <button disabled={usersPage === 1} onClick={() => setUsersPage(p => p - 1)} className="p-1 rounded-lg hover:bg-gray-200 disabled:opacity-50">
                                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <span className="text-sm font-medium text-gray-600">Page {usersPage} of {totalUserPages}</span>
                                    <button disabled={usersPage === totalUserPages} onClick={() => setUsersPage(p => p + 1)} className="p-1 rounded-lg hover:bg-gray-200 disabled:opacity-50">
                                        <ChevronRight className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            )}

            {}
            {activeTab === 'audit' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Audit Trail <span className="text-gray-400 font-normal text-sm">({auditLogs.total} entries)</span></h2>
                    {isLoading ? (
                        <div className="mt-4"><SkeletonLoader type="table" count={5} /></div>
                    ) : auditLogs.logs?.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">No audit logs yet — actions will appear here</div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            {['Timestamp', 'User', 'Action', 'Entity', 'Change'].map(h => (
                                                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {auditLogs.logs?.map((log, i) => (
                                            <motion.tr key={log._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                                                className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</td>
                                                <td className="px-4 py-3 text-xs font-medium text-gray-700">{log.userId?.name || '—'}<br /><span className="text-gray-400">{log.userId?.email}</span></td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-violet-100 text-violet-700">{log.actionType}</span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-600">{log.affectedEntity}</td>
                                                <td className="px-4 py-3 text-xs text-gray-500 font-mono">
                                                    {log.oldValue && <span className="text-red-400">{JSON.stringify(log.oldValue)}</span>}
                                                    {log.oldValue && log.newValue && ' → '}
                                                    {log.newValue && <span className="text-emerald-500">{JSON.stringify(log.newValue)}</span>}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {}
            <AnimatePresence>
                {statusModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={e => e.target === e.currentTarget && setStatusModal(null)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="bg-gradient-to-r from-violet-600 to-purple-700 p-6 flex justify-between items-center">
                                <h3 className="text-xl font-extrabold text-white">Update Request Status</h3>
                                <button onClick={() => setStatusModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">New Status</label>
                                    <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-violet-300 outline-none">
                                        {['Approved', 'Rejected'].map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                {statusModal.type === 'request' && (newStatus === 'Donor Assigned' || newStatus === 'Approved') && (
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Donor ID (optional)</label>
                                        <input type="text" value={donorIdInput} placeholder="MongoDB ObjectId of donor"
                                            onChange={e => setDonorIdInput(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-violet-300 outline-none" />
                                    </div>
                                )}
                                {statusModal.type === 'request' && (
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Note (optional)</label>
                                        <textarea value={statusNote} rows={2} placeholder="Admin note..."
                                            onChange={e => setStatusNote(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-violet-300 outline-none resize-none" />
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <button onClick={() => setStatusModal(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">
                                        Cancel
                                    </button>
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={handleUpdateStatus} disabled={isLoading}
                                        className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                                        {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Confirm Update'}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
