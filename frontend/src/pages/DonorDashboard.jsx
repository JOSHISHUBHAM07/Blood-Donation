import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
    Heart, Calendar, CheckCircle2, AlertCircle, Clock, Loader2,
    ToggleLeft, ToggleRight, Plus, X, MapPin
} from 'lucide-react';
import {
    fetchDonationHistory,
    scheduleDonation, updateAvailability, resetDonor
} from '../features/donor/donorSlice';
import SkeletonLoader from '../components/SkeletonLoader';
import MapLocator from '../components/MapLocator';

const statusColors = {
    Pending: 'bg-amber-100 text-amber-700',
    Approved: 'bg-blue-100 text-blue-700',
    Scheduled: 'bg-purple-100 text-purple-700',
    Completed: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-700',
    Cancelled: 'bg-gray-100 text-gray-600',
};

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }),
};

export default function DonorDashboard() {
    const dispatch = useDispatch();
    const { user } = useSelector(s => s.auth);
    const { donations, isLoading, isError, isSuccess, message } = useSelector(s => s.donor);

    const [activeTab, setActiveTab] = useState('active');
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [available, setAvailable] = useState(user?.isAvailable ?? true);
    const [form, setForm] = useState({ date: '', location: '', units: 1 });

    useEffect(() => {
        dispatch(fetchDonationHistory());
    }, [dispatch]);

    useEffect(() => {
        if (isError) { toast.error(message); dispatch(resetDonor()); }
        if (isSuccess && !isLoading) {
            toast.success('Done!');
            setShowScheduleModal(false);
            dispatch(resetDonor());
            dispatch(fetchDonationHistory());
        }
    }, [isError, isSuccess, message, isLoading, dispatch]);

    const handleToggleAvailability = () => {
        const newVal = !available;
        setAvailable(newVal);
        dispatch(updateAvailability(newVal)).then(() =>
            toast.success(`You are now ${newVal ? 'available' : 'unavailable'} for donation`)
        );
    };

    const handleSchedule = (e) => {
        e.preventDefault();
        if (!form.date || !form.location) { toast.error('Fill all required fields'); return; }
        dispatch(scheduleDonation(form));
    };

    // Reverse geocode lat/lng to auto-fill donor location
    const handleDonorMapSelect = async (loc) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${loc.lat}&lon=${loc.lng}&format=json`,
                { headers: { 'Accept-Language': 'en' } }
            );
            const data = await res.json();
            const place = data.display_name || data.address?.road || '';
            const shortPlace = place.split(',').slice(0, 2).join(',').trim();
            setForm(f => ({ ...f, location: shortPlace || `${loc.lat.toFixed(4)},${loc.lng.toFixed(4)}` }));
            if (shortPlace) toast.success('Location auto-filled!');
        } catch {
            setForm(f => ({ ...f, location: `${loc.lat.toFixed(4)},${loc.lng.toFixed(4)}` }));
        }
    };

    const stats = {
        total: donations.length,
        completed: donations.filter(d => d.status === 'Completed').length,
        scheduled: donations.filter(d => d.status === 'Scheduled').length,
        pending: donations.filter(d => d.status === 'Pending').length,
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div variants={cardVariants} custom={0} initial="hidden" animate="show" className="mb-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
                            <Heart className="w-5 h-5 text-white fill-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-900">Donor Dashboard</h1>
                            <p className="text-gray-500 text-sm">Blood group: <span className="font-bold text-rose-600">{user?.bloodGroup || '—'}</span></p>
                        </div>
                    </div>
                    {/* Availability Toggle */}
                    <button onClick={handleToggleAvailability}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm border-2 transition-all ${available ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                        {available ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                        {available ? 'Available' : 'Unavailable'}
                    </button>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Donations', value: stats.total, icon: Heart, color: 'from-rose-500 to-pink-500' },
                    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'from-emerald-500 to-green-500' },
                    { label: 'Scheduled', value: stats.scheduled, icon: Clock, color: 'from-blue-500 to-blue-600' },
                    { label: 'Pending', value: stats.pending, icon: AlertCircle, color: 'from-amber-400 to-amber-500' },
                ].map((s, i) => (
                    <motion.div key={i} variants={cardVariants} custom={i} initial="hidden" animate="show"
                        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow`}>
                            <s.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
                        <div className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
                {['active', 'history'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        {tab === 'active' ? '💉 Active Donations' : '🕰️ History'}
                    </button>
                ))}
            </div>

            {/* Active Donations */}
            {activeTab === 'active' && (() => {
                const activeDonations = donations.filter(d => ['Pending', 'Approved', 'Scheduled'].includes(d.status));
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Active Donations</h2>
                            <motion.button whileHover={available ? { scale: 1.04 } : {}} whileTap={available ? { scale: 0.96 } : {}}
                                onClick={() => available ? setShowScheduleModal(true) : toast.error('You must be available to schedule a donation')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all ${available ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                                <Plus className="w-4 h-4" /> Schedule Donation
                            </motion.button>
                        </div>

                        {isLoading ? (
                            <div className="mt-4"><SkeletonLoader type="card" count={3} /></div>
                        ) : activeDonations.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                                <Heart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-400 font-medium">No active donations</p>
                                <button onClick={() => available ? setShowScheduleModal(true) : toast.error('You must be available to schedule a donation')} className={`mt-4 font-semibold text-sm ${available ? 'text-rose-500 hover:underline' : 'text-gray-400 cursor-not-allowed'}`}>+ Schedule a donation</button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activeDonations.map((d, i) => (
                                    <motion.div key={d._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all flex flex-wrap items-center justify-between gap-3 ${d.status === 'Pending' ? 'opacity-60 blur-[1.5px] hover:blur-none hover:opacity-100' : ''}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm bg-blue-50">
                                                💉
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 flex items-center gap-2">
                                                    {new Date(d.date).toLocaleDateString()}
                                                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${statusColors[d.status] || 'bg-gray-100 text-gray-600'}`}>{d.status}</span>
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <MapPin className="w-3.5 h-3.5" /> {d.location} · {d.units} unit(s)
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                );
            })()}

            {/* Donation History — only Rejected */}
            {activeTab === 'history' && (() => {
                const historyDonations = donations.filter(d => d.status === 'Rejected');
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Donation History</h2>
                        </div>

                        {isLoading ? (
                            <div className="mt-4"><SkeletonLoader type="card" count={3} /></div>
                        ) : historyDonations.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                                <Heart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-400 font-medium">No past donations</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {historyDonations.map((d, i) => (
                                    <motion.div key={d._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-wrap items-center justify-between gap-3 opacity-80">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm bg-gray-50">
                                                ❌
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 flex items-center gap-2">
                                                    {new Date(d.date).toLocaleDateString()}
                                                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${statusColors[d.status] || 'bg-gray-100 text-gray-600'}`}>{d.status}</span>
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <MapPin className="w-3.5 h-3.5" /> {d.location} · {d.units} unit(s)
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                );
            })()}

            {/* Schedule Donation Modal */}
            <AnimatePresence>
                {showScheduleModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={e => e.target === e.currentTarget && setShowScheduleModal(false)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6 flex justify-between items-center">
                                <h3 className="text-xl font-extrabold text-white">Schedule Donation</h3>
                                <button onClick={() => setShowScheduleModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <form onSubmit={handleSchedule} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Donation Date *</label>
                                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-300 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Location * <span className="font-normal text-gray-400">(click map or type)</span></label>
                                    <MapLocator onLocationSelect={handleDonorMapSelect} />
                                    <input type="text" value={form.location} placeholder="e.g. City Blood Bank"
                                        onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-300 outline-none mt-2" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Units *</label>
                                    <input type="number" min="1" value={form.units} onChange={e => setForm(f => ({ ...f, units: +e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-300 outline-none" />
                                </div>

                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading}
                                    className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Scheduling...</> : '💉 Schedule Donation'}
                                </motion.button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
