import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { reset, updateProfile } from '../features/auth/authSlice';
import toast from 'react-hot-toast';
import { User, Mail, MapPin, Phone, Shield, Droplet, Loader2, Save } from 'lucide-react';

export default function ProfileSettings() {
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, message } = useSelector(s => s.auth);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        contact: user?.contact || '',
        address: user?.address || '',
        bloodGroup: user?.bloodGroup || '',
        password: '',
        isAvailable: user?.isAvailable ?? true
    });

    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }
        if (isSuccess && message !== 'Login successful') {
            toast.success('Profile updated successfully');
            dispatch(reset());
        }
    }, [isError, isSuccess, message, dispatch]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSubmit = { ...formData };
        if (!dataToSubmit.password) delete dataToSubmit.password;
        dispatch(updateProfile(dataToSubmit));
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-8 flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white backdrop-blur-md flex items-center justify-center text-4xl font-extrabold text-white shadow-lg">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-white">{user?.name}</h1>
                        <p className="text-rose-100 flex items-center gap-2 mt-1 font-medium">
                            <Shield className="w-4 h-4" /> {user?.role?.toUpperCase()}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Static Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1.5 flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> Email Address</label>
                            <input type="email" value={user?.email} disabled
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" />
                        </div>
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1.5 flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /> Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all" />
                        </div>
                        {/* Contact Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1.5 flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> Contact Number</label>
                            <input type="text" name="contact" value={formData.contact} onChange={handleChange}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all" />
                        </div>
                        {/* Blood Group */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1.5 flex items-center gap-2"><Droplet className="w-4 h-4 text-gray-400" /> Blood Group</label>
                            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all">
                                <option value="">Select Group...</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                            </select>
                        </div>
                        {/* Address Field */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-600 mb-1.5 flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all" />
                        </div>
                        {/* Password Update */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-600 mb-1.5">New Password (leave blank to keep current)</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all" />
                        </div>
                    </div>

                    {user?.role === 'donor' && (
                        <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100 flex items-center justify-between mt-6">
                            <div>
                                <h3 className="font-bold text-gray-800">Donor Availability</h3>
                                <p className="text-sm text-gray-500 mt-1">Are you currently available to be matched with critical blood requests?</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} className="sr-only peer" />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-rose-500"></div>
                            </label>
                        </div>
                    )}

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading}
                            className="bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70">
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </motion.button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
