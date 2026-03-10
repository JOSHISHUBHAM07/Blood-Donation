import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { Droplet, LogOut, UserPlus, LogIn, UserCircle, Menu, X, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
        setIsMenuOpen(false);
    };

    const getDashboardLink = () => {
        if (user?.role === 'admin') return '/admin';
        if (user?.role === 'patient') return '/patient';
        if (user?.role === 'donor') return '/donor';
        return '/';
    };

    const getRoleBadgeColor = () => {
        if (user?.role === 'admin') return 'bg-violet-100 text-violet-700';
        if (user?.role === 'patient') return 'bg-blue-100 text-blue-700';
        if (user?.role === 'donor') return 'bg-rose-100 text-rose-700';
        return 'bg-gray-100 text-gray-600';
    };

    return (
        <nav className="glass-nav relative z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Brand */}
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 text-xl font-bold tracking-wider text-primary group">
                        <motion.div whileHover={{ scale: 1.1, rotate: 10 }} whileTap={{ scale: 0.9 }}>
                            <Droplet className="w-8 h-8 fill-primary stroke-primary drop-shadow-sm group-hover:fill-secondary transition-colors" />
                        </motion.div>
                        <span className="group-hover:text-secondary transition-colors">Life Flow</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-3 items-center">
                        {user ? (
                            <>
                                <div className="flex items-center gap-2 mr-1">
                                    <span className="font-medium text-gray-700">Hi, <span className="text-primary font-semibold">{user.name?.split(' ')[0]}</span></span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${getRoleBadgeColor()}`}>{user.role}</span>
                                </div>
                                <Link to={getDashboardLink()}
                                    className="flex items-center space-x-1.5 text-gray-600 hover:text-primary font-medium transition-colors border border-gray-200 px-3 py-1.5 rounded-full hover:bg-rose-50 hover:border-rose-200">
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>Dashboard</span>
                                </Link>
                                <Link to="/profile"
                                    className={`text-gray-600 hover:text-primary font-medium transition-colors flex items-center space-x-1 border px-3 py-1.5 rounded-full hover:bg-gray-50 ${location.pathname === '/profile' ? 'border-primary/30 bg-rose-50 text-primary' : 'border-gray-200'}`}>
                                    <UserCircle className="w-4 h-4" />
                                    <span>Profile</span>
                                </Link>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onLogout}
                                    className="btn-outline flex items-center space-x-2 text-sm px-4 py-1.5 rounded-full"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition-colors flex items-center space-x-1 px-3 py-1.5 rounded-full hover:bg-gray-50">
                                    <LogIn className="w-4 h-4" />
                                    <span>Login</span>
                                </Link>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link to="/register" className="btn-primary flex items-center justify-center space-x-2 text-sm px-5 py-2 w-auto shadow-md">
                                        <UserPlus className="w-4 h-4" />
                                        <span>Sign Up</span>
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <motion.button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-600 hover:text-primary focus:outline-none p-2 rounded-xl transition-colors hover:bg-rose-50"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div key={isMenuOpen ? 'x' : 'menu'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                </motion.div>
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-xl overflow-hidden absolute top-16 left-0 w-full"
                    >
                        <div className="px-4 py-5 space-y-2 flex flex-col">
                            {user ? (
                                <>
                                    <div className="pb-3 border-b border-gray-100 mb-1 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-extrabold text-lg shadow">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <span className="block text-sm font-bold text-gray-800">{user.name}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${getRoleBadgeColor()}`}>{user.role}</span>
                                        </div>
                                    </div>
                                    <Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center space-x-3 text-gray-700 hover:text-primary p-3 rounded-xl hover:bg-rose-50 transition-colors font-medium">
                                        <LayoutDashboard className="w-5 h-5" />
                                        <span>Dashboard</span>
                                    </Link>
                                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center space-x-3 text-gray-700 hover:text-primary p-3 rounded-xl hover:bg-rose-50 transition-colors font-medium">
                                        <UserCircle className="w-5 h-5" />
                                        <span>Profile Settings</span>
                                    </Link>
                                    <button onClick={onLogout}
                                        className="flex items-center space-x-3 text-red-500 hover:text-red-700 p-3 rounded-xl hover:bg-red-50 transition-colors font-medium text-left w-full mt-1">
                                        <LogOut className="w-5 h-5" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center space-x-3 text-gray-700 hover:text-primary p-3 rounded-xl hover:bg-rose-50 transition-colors font-medium">
                                        <LogIn className="w-5 h-5" />
                                        <span>Sign In</span>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center space-x-2 btn-primary text-base px-5 py-3.5 mt-2 w-full shadow-md rounded-xl">
                                        <UserPlus className="w-5 h-5" />
                                        <span>Create an Account</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
