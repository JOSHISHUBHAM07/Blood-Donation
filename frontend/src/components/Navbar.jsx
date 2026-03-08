import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { Droplet, LogOut, UserPlus, LogIn, UserCircle, Menu, X } from 'lucide-react';
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

    // Close menu when route changes
    useState(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
                    <div className="hidden md:flex space-x-6 items-center">
                        {user ? (
                            <>
                                <span className="font-medium text-gray-700 mr-2">Hi, <span className="text-primary font-semibold">{user.name}</span></span>
                                <Link to="/profile" className="text-gray-600 hover:text-primary font-medium transition-colors flex items-center space-x-1 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50">
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
                                <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition-colors flex items-center space-x-1">
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
                        <button
                            onClick={toggleMenu}
                            className="text-gray-600 hover:text-primary focus:outline-none p-2 rounded-md transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
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
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="md:hidden bg-white border-b border-gray-200 shadow-lg overflow-hidden absolute top-16 left-0 w-full"
                    >
                        <div className="px-4 py-5 space-y-4 flex flex-col">
                            {user ? (
                                <>
                                    <div className="pb-3 border-b border-gray-100 mb-2">
                                        <span className="block text-sm text-gray-500">Logged in as</span>
                                        <span className="block text-lg font-bold text-gray-800">{user.name}</span>
                                    </div>
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center space-x-3 text-gray-700 hover:text-primary p-3 rounded-lg hover:bg-rose-50 transition-colors font-medium border border-transparent hover:border-rose-100"
                                    >
                                        <UserCircle className="w-5 h-5" />
                                        <span>My Profile / Dashboard</span>
                                    </Link>
                                    <button
                                        onClick={onLogout}
                                        className="flex items-center space-x-3 text-red-500 hover:text-red-700 p-3 rounded-lg hover:bg-red-50 transition-colors font-medium text-left w-full border border-transparent hover:border-red-100 mt-2"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center space-x-3 text-gray-700 hover:text-primary p-3 rounded-lg hover:bg-rose-50 transition-colors font-medium border border-transparent hover:border-rose-100"
                                    >
                                        <LogIn className="w-5 h-5" />
                                        <span>Sign In</span>
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center space-x-2 btn-primary text-base px-5 py-3.5 mt-2 w-full shadow-md rounded-xl"
                                    >
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
