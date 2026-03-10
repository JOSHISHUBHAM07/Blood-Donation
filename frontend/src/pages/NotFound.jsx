import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="min-h-[75vh] flex flex-col items-center justify-center p-4 text-center"
        >
            {/* Icon */}
            <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-28 h-28 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mb-6 shadow-lg ring-4 ring-rose-100"
            >
                <AlertTriangle className="w-14 h-14 text-rose-500" />
            </motion.div>

            {/* 404 */}
            <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 mb-2 leading-none">
                404
            </h1>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">Page Not Found</h2>

            <p className="text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
                Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                    <Home className="w-5 h-5" />
                    Back to Home
                </Link>
                <button onClick={() => window.history.back()}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                    Go Back
                </button>
            </div>
        </motion.div>
    );
}
