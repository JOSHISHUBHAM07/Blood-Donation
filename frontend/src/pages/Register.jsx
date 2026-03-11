import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../features/auth/authSlice';
import { motion } from 'framer-motion';
import { Droplet, User, Mail, Lock, ArrowRight, Users, Heart, Sparkles, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'donor',
        bloodGroup: 'A+',
        contact: '',
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, isError, message } = useSelector((state) => state.auth);

    const onChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const onSubmit = (e) => {
        e.preventDefault();

        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.email.trim())) {
            toast.error('Please enter a valid email address');
            return;
        }

        
        const digitsOnly = formData.contact.replace(/\D/g, '');
        if (digitsOnly.length !== 10) {
            toast.error('Phone number must be exactly 10 digits');
            return;
        }

        dispatch(register({ ...formData, contact: digitsOnly })).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                toast.success('Registration successful! Welcome.');
                const role = result.payload?.role;
                if (role === 'admin') navigate('/admin');
                else if (role === 'patient') navigate('/patient');
                else navigate('/donor');
            } else {
                toast.error(message || result.payload || 'Registration failed');
            }
            dispatch(reset());
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-[85vh] flex items-center justify-center relative z-10 px-4 py-6 md:py-10"
        >
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/40">

                {}
                <div className="relative hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-primary/30 to-transparent rounded-full pointer-events-none" />
                    <div className="absolute bottom-10 right-0 w-40 h-40 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-rose-500/20 to-transparent rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-10">
                            <Droplet className="w-7 h-7 text-primary fill-primary" />
                            <span className="text-white font-extrabold text-xl tracking-tight">Life Flow</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-white leading-snug mb-4">
                            Join the<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Life-Saving Community</span>
                        </h2>
                        <p className="text-gray-400 text-base leading-relaxed">
                            Register as a donor, patient, or admin and be part of something bigger than yourself.
                        </p>
                    </div>

                    <div className="relative z-10 mt-10 space-y-3">
                        {[
                            { icon: Users, text: 'Join 10,000+ registered members' },
                            { icon: Heart, text: 'Save up to 3 lives per donation' },
                            { icon: Sparkles, text: 'Free, fast & easy to use' },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3 text-gray-300 text-sm">
                                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                    <Icon className="w-4 h-4 text-rose-400" />
                                </div>
                                {text}
                            </div>
                        ))}
                    </div>
                </div>

                {}
                <div className="bg-white/80 backdrop-blur-xl p-6 md:p-10 flex flex-col justify-center">
                    <div className="mb-6 md:mb-8">
                        <span className="text-4xl mb-3 inline-block">✨</span>
                        <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Create Account</h2>
                        <p className="text-gray-500 mt-1 text-sm">Start giving or requesting blood today</p>
                    </div>

                    {isError && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-200 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            {message}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text" name="name" value={formData.name} onChange={onChange}
                                    placeholder="John Doe" required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-base"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email" name="email" value={formData.email} onChange={onChange}
                                    placeholder="you@example.com" required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-base"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
                                <select
                                    name="role" value={formData.role} onChange={onChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none text-base"
                                >
                                    <option value="donor">Donor</option>
                                    <option value="patient">Patient</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Blood Group</label>
                                <select
                                    name="bloodGroup" value={formData.bloodGroup} onChange={onChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none text-base"
                                >
                                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="tel" name="contact" value={formData.contact} onChange={onChange}
                                    placeholder="e.g., +91 98765 43210" required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-base"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="password" name="password" value={formData.password} onChange={onChange}
                                    placeholder="••••••••" required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-base"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-rose-500 text-white font-bold text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-1 md:mt-2"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                <>Create Account <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500 mb-2 md:mb-0">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-bold hover:text-rose-600 transition-colors">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default Register;
