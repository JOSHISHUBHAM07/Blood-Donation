import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
    Droplet, Activity, AlertTriangle, CheckCircle, Clock,
    Plus, X, Calendar, Hospital, Phone, FileText, ChevronDown, Loader2, MapPin
} from 'lucide-react';
import {
    fetchMyRequests, createRequest, cancelRequest,
    fetchBloodStock, resetPatient
} from '../features/patient/patientSlice';
import SkeletonLoader from '../components/SkeletonLoader';
import MapLocator from '../components/MapLocator';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const EMERGENCY_LEVELS = ['Low', 'Medium', 'High', 'Critical'];

const statusColors = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Approved: 'bg-blue-100 text-blue-700 border-blue-200',
    'Donor Assigned': 'bg-purple-100 text-purple-700 border-purple-200',
    Completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Rejected: 'bg-red-100 text-red-700 border-red-200',
    Cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
};

const emergencyColors = {
    Low: 'text-green-600 bg-green-50',
    Medium: 'text-yellow-600 bg-yellow-50',
    High: 'text-orange-600 bg-orange-50',
    Critical: 'text-red-600 bg-red-50 animate-pulse',
};

const priorityBadge = (score) => {
    if (score >= 70) return 'bg-red-500 text-white';
    if (score >= 50) return 'bg-orange-400 text-white';
    if (score >= 30) return 'bg-yellow-400 text-gray-900';
    return 'bg-gray-200 text-gray-700';
};

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function PatientDashboard() {
    const dispatch = useDispatch();
    const { user } = useSelector((s) => s.auth);
    const { requests, bloodStock, isLoading, isError, isSuccess, message } = useSelector((s) => s.patient);

    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('requests');
    const [form, setForm] = useState({
        bloodGroup: 'A+', quantity: 1, hospital: '',
        requiredDate: '', emergencyLevel: 'High',
        contactDetails: '', medicalReason: '', location: null
    });

    useEffect(() => {
        dispatch(fetchMyRequests());
        dispatch(fetchBloodStock());
    }, [dispatch]);

    useEffect(() => {
        if (isError) { toast.error(message); dispatch(resetPatient()); }
        if (isSuccess && !isLoading) {
            toast.success('Blood request submitted!');
            setShowModal(false);
            dispatch(resetPatient());
        }
    }, [isError, isSuccess, message, isLoading, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.hospital || !form.requiredDate || !form.contactDetails) {
            toast.error('Please fill all required fields');
            return;
        }
        dispatch(createRequest(form));
    };

    const handleCancel = (id) => {
        if (window.confirm('Cancel this request?')) {
            dispatch(cancelRequest(id)).then(() => {
                dispatch(fetchMyRequests());
                toast.success('Request cancelled');
            });
        }
    };

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'Pending').length,
        approved: requests.filter(r => ['Approved', 'Donor Assigned'].includes(r.status)).length,
        completed: requests.filter(r => r.status === 'Completed').length,
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div variants={cardVariants} initial="hidden" animate="show" className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
                        <Droplet className="w-5 h-5 text-white fill-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">Patient Dashboard</h1>
                        <p className="text-gray-500 text-sm">Welcome back, <span className="font-semibold text-rose-600">{user?.name}</span></p>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Requests', value: stats.total, icon: Activity, color: 'from-blue-500 to-blue-600' },
                    { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-amber-400 to-amber-500' },
                    { label: 'In Progress', value: stats.approved, icon: AlertTriangle, color: 'from-purple-500 to-purple-600' },
                    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'from-emerald-500 to-emerald-600' },
                ].map((s, i) => (
                    <motion.div
                        key={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="show"
                        transition={{ delay: i * 0.08 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow`}>
                            <s.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
                        <div className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
                {['requests', 'blood-availability'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {tab === 'requests' ? '🩸 My Requests' : '📊 Blood Availability'}
                    </button>
                ))}
            </div>

            {/* Requests Tab */}
            {activeTab === 'requests' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Blood Requests</h2>
                        <motion.button
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-semibold text-sm shadow-md shadow-rose-200 hover:shadow-lg transition-all"
                        >
                            <Plus className="w-4 h-4" /> New Request
                        </motion.button>
                    </div>

                    {isLoading ? (
                        <div className="mt-4"><SkeletonLoader type="card" count={3} /></div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                            <Droplet className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-400 font-medium">No blood requests yet</p>
                            <button onClick={() => setShowModal(true)} className="mt-4 text-rose-500 font-semibold text-sm hover:underline">+ Create your first request</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((req, i) => (
                                <motion.div
                                    key={req._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white font-extrabold text-lg shadow">
                                                {req.bloodGroup}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800">{req.hospital}</div>
                                                <div className="text-sm text-gray-500">{req.quantity} unit(s) · {new Date(req.requiredDate).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${emergencyColors[req.emergencyLevel]}`}>{req.emergencyLevel}</span>
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${statusColors[req.status] || 'bg-gray-100 text-gray-600'}`}>{req.status}</span>
                                            {req.priorityScore > 0 && (
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${priorityBadge(req.priorityScore)}`}>
                                                    Score: {req.priorityScore}
                                                </span>
                                            )}
                                            {req.status === 'Pending' && (
                                                <button onClick={() => handleCancel(req._id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Cancel">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {req.medicalReason && (
                                        <p className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">{req.medicalReason}</p>
                                    )}
                                    {req.assignedDonorId && (
                                        <div className="mt-3 text-sm text-purple-600 font-medium bg-purple-50 rounded-lg px-3 py-2">
                                            Donor Assigned: {req.assignedDonorId.name} · {req.assignedDonorId.contact}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}

            {/* Blood Availability Tab */}
            {activeTab === 'blood-availability' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Current Blood Stock</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {BLOOD_GROUPS.map(bg => {
                            const item = bloodStock.find(s => s.bloodGroup === bg);
                            const units = item ? item.unitsAvailable : 0;
                            const level = units === 0 ? 'empty' : units < 5 ? 'low' : 'ok';
                            return (
                                <motion.div
                                    key={bg}
                                    whileHover={{ scale: 1.03, y: -2 }}
                                    className={`rounded-2xl p-6 text-center border-2 transition-all ${level === 'empty' ? 'bg-red-50 border-red-200' : level === 'low' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}
                                >
                                    <div className="text-3xl font-extrabold text-gray-900 mb-1">{bg}</div>
                                    <div className={`text-2xl font-black ${level === 'empty' ? 'text-red-500' : level === 'low' ? 'text-amber-500' : 'text-emerald-600'}`}>
                                        {units}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">units</div>
                                    <div className={`mt-2 text-xs font-bold uppercase tracking-wide ${level === 'empty' ? 'text-red-500' : level === 'low' ? 'text-amber-500' : 'text-emerald-600'}`}>
                                        {level === 'empty' ? '⚠ None' : level === 'low' ? '⚡ Low' : '✓ OK'}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* Create Request Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
                >
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative"
                    >
                        <div className="bg-gradient-to-r from-rose-500 to-red-600 p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-extrabold text-white">New Blood Request</h3>
                                <p className="text-rose-100 text-sm mt-0.5">Fill details to submit your request</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Blood Group *</label>
                                    <select value={form.bloodGroup} onChange={e => setForm(f => ({ ...f, bloodGroup: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none">
                                        {BLOOD_GROUPS.map(bg => <option key={bg}>{bg}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Quantity (units) *</label>
                                    <input type="number" min="1" value={form.quantity}
                                        onChange={e => setForm(f => ({ ...f, quantity: +e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5"><Hospital className="inline w-3.5 h-3.5 mr-1" />Hospital *</label>
                                <input type="text" value={form.hospital} placeholder="e.g. City General Hospital"
                                    onChange={e => setForm(f => ({ ...f, hospital: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5"><Calendar className="inline w-3.5 h-3.5 mr-1" />Required Date *</label>
                                    <input type="date" value={form.requiredDate}
                                        onChange={e => setForm(f => ({ ...f, requiredDate: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Emergency Level *</label>
                                    <select value={form.emergencyLevel}
                                        onChange={e => setForm(f => ({ ...f, emergencyLevel: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none">
                                        {EMERGENCY_LEVELS.map(l => <option key={l}>{l}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5"><MapPin className="inline w-3.5 h-3.5 mr-1" />Hospital Location</label>
                                <MapLocator onLocationSelect={(loc) => setForm(f => ({ ...f, location: loc }))} />
                                <p className="text-[10px] text-gray-400 mt-1">Select the location of the hospital to help donors find you.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5"><Phone className="inline w-3.5 h-3.5 mr-1" />Contact Details *</label>
                                <input type="text" value={form.contactDetails} placeholder="Phone / email"
                                    onChange={e => setForm(f => ({ ...f, contactDetails: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5"><FileText className="inline w-3.5 h-3.5 mr-1" />Medical Reason</label>
                                <textarea value={form.medicalReason} rows={2} placeholder="Brief medical reason"
                                    onChange={e => setForm(f => ({ ...f, medicalReason: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none resize-none" />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                type="submit" disabled={isLoading}
                                className="w-full py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : '🩸 Submit Request'}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
