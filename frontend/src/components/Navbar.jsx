import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { Droplet, LogOut, UserPlus, LogIn, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    return (
        <nav className="glass-nav relative z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-wider text-primary group">
                        <motion.div whileHover={{ scale: 1.1, rotate: 10 }} whileTap={{ scale: 0.9 }}>
                            <Droplet className="w-8 h-8 fill-primary stroke-primary drop-shadow-sm group-hover:fill-secondary transition-colors" />
                        </motion.div>
                        <span className="group-hover:text-secondary transition-colors">Life Flow</span>
                    </Link>
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
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
