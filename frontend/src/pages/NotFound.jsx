import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center"
        >
            <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <AlertTriangle className="w-12 h-12 text-rose-500" />
            </div>

            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600 mb-4">
                404
            </h1>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>

            <p className="text-gray-500 max-w-md mx-auto mb-8">
                Oops! The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
            </p>

            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                <Home className="w-5 h-5" />
                Back to Home
            </Link>
        </motion.div>
    );
}
