import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const SkeletonLoader = ({ count = 3, type = 'card' }) => {
    const skeletons = Array.from({ length: count });

    if (type === 'card') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
                {skeletons.map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl min-h-[200px] flex flex-col justify-between"
                    >
                        <div>
                            <div className="h-6 bg-white/20 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-white/20 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-white/20 rounded w-5/6 mb-4"></div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <div className="h-10 bg-white/20 rounded-full w-24"></div>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    }

    if (type === 'table') {
        return (
            <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-white/20 rounded-xl w-full mb-6"></div>
                    {skeletons.map((_, i) => (
                        <div key={i} className="h-16 bg-white/10 rounded-xl w-full"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-pulse space-y-4 w-full">
            {skeletons.map((_, i) => (
                <div key={i} className="h-4 bg-white/20 rounded-md w-[80%]"></div>
            ))}
        </div>
    );
};

SkeletonLoader.propTypes = {
    count: PropTypes.number,
    type: PropTypes.string,
};

export default SkeletonLoader;
