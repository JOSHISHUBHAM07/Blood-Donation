import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../features/auth/authSlice';
import { motion } from 'framer-motion';
import { Droplet, Mail, Lock, ArrowRight, Heart, ShieldCheck, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { email, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            console.error(message);
            toast.error(message || 'Login failed');
        }
        if (isSuccess) {
            toast.success('Successfully logged in!');
        }
        if (isSuccess || user) {
            if (user?.role === 'admin') navigate('/admin');
            else if (user?.role === 'patient') navigate('/patient');
            else if (user?.role === 'donor') navigate('/donor');
            else navigate('/');
        }
        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-[85vh] flex items-center justify-center relative z-10 px-4 py-10"
        >
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/40">

                {/* Left — Dark Brand Panel */}
                <div className="relative hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
                    {/* Orbs */}
                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-primary/30 rounded-full blur-[60px] pointer-events-none" />
                    <div className="absolute bottom-10 right-0 w-40 h-40 bg-rose-500/20 rounded-full blur-[50px] pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-10">
                            <Droplet className="w-7 h-7 text-primary fill-primary" />
                            <span className="text-white font-extrabold text-xl tracking-tight">Life Flow</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-white leading-snug mb-4">
                            Welcome<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Back, Hero</span>
                        </h2>
                        <p className="text-gray-400 text-base leading-relaxed">
                            Every login is a step closer to saving a life. The community needs you.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-3 mt-10">
                        {[
                            { icon: Activity, text: 'Real-time request tracking' },
                            { icon: ShieldCheck, text: 'Secure & encrypted data' },
                            { icon: Heart, text: 'Community-driven platform' },
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

                {/* Right — Form Panel */}
                <div className="bg-white/80 backdrop-blur-xl p-10 flex flex-col justify-center">
                    <div className="mb-8">
                        <span className="text-4xl mb-3 inline-block">🩸</span>
                        <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Sign In</h2>
                        <p className="text-gray-500 mt-1 text-sm">Enter your credentials to continue</p>
                    </div>

                    {isError && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-200 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            {message}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-rose-500 text-white font-bold text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                <>Sign In <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary font-bold hover:text-rose-600 transition-colors">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default Login;
