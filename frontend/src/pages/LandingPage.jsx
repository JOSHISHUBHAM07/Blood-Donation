import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Heart,
    Activity,
    Users,
    ShieldCheck,
    ArrowRight,
    ArrowDown,
    Droplet,
    Database,
    Bell,
    Lock,
    CheckCircle,
    Info,
    Calendar,
    Sparkles,
    Star
} from 'lucide-react';

const services = [
    {
        icon: Calendar,
        title: 'Blood Donation Management',
        desc: 'A secure platform for donors to register and schedule blood donations easily.',
        color: 'text-rose-600',
        bg: 'bg-rose-50',
        border: 'border-rose-100',
        glow: 'group-hover:shadow-rose-200',
        badge: 'Donor',
        badgeColor: 'bg-rose-100 text-rose-600',
    },
    {
        icon: Bell,
        title: 'Blood Request System',
        desc: 'Patients can quickly raise emergency blood requests with real-time status tracking.',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-100',
        glow: 'group-hover:shadow-blue-200',
        badge: 'Patient',
        badgeColor: 'bg-blue-100 text-blue-600',
    },
    {
        icon: Database,
        title: 'Blood Stock Monitoring',
        desc: 'Admins can manage and monitor blood inventory with live dashboards and alerts.',
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-100',
        glow: 'group-hover:shadow-purple-200',
        badge: 'Admin',
        badgeColor: 'bg-purple-100 text-purple-600',
    },
    {
        icon: Lock,
        title: 'Secure Authentication',
        desc: 'Role-based login system ensuring complete privacy and security of medical data.',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-100',
        glow: 'group-hover:shadow-emerald-200',
        badge: 'Secure',
        badgeColor: 'bg-emerald-100 text-emerald-600',
    },
];

const features = [
    { icon: Activity, label: 'Fast & Reliable', color: 'text-rose-500', bg: 'bg-rose-50' },
    { icon: Users, label: 'Community Driven', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: ShieldCheck, label: 'Secure & Verified', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: Heart, label: 'Easy Registration', color: 'text-pink-500', bg: 'bg-pink-50' },
];

const LandingPage = () => {
    const bottomRef = useRef(null);
    const pageRef = useRef(null);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 60 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div ref={pageRef} className="relative w-full flex flex-col items-center">

            {}
            <motion.button
                onClick={scrollToBottom}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                className="fixed right-6 bottom-8 z-50 flex flex-col items-center gap-2 group"
                title="Scroll to bottom"
            >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-rose-400 shadow-lg shadow-primary/40 flex items-center justify-center text-white group-hover:shadow-xl group-hover:shadow-primary/50 transition-all duration-300">
                    <ArrowDown className="w-5 h-5 animate-bounce" />
                </div>
                <span className="text-[10px] font-semibold text-gray-400 group-hover:text-primary transition-colors uppercase tracking-widest">Scroll</span>
            </motion.button>

            {}
            <div className="relative min-h-screen flex flex-col items-center justify-center w-full px-4 pt-16 pb-10">

                {}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-rose-300/30 via-orange-200/10 to-transparent rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
                        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        className="absolute -bottom-40 -right-20 w-[600px] h-[600px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-blue-300/20 via-primary/10 to-transparent rounded-full"
                    />
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        className="absolute top-1/3 right-[12%] w-64 h-64 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-purple-200/20 to-transparent rounded-full"
                    />
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="text-center max-w-4xl mx-auto relative z-10"
                >
                    {}
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/10 to-rose-100 border border-primary/20 text-primary font-semibold text-sm mb-8 shadow-sm">
                        <Sparkles className="w-4 h-4 text-rose-400" />
                        <span>Every Drop Counts — Save Lives Today</span>
                        <Sparkles className="w-4 h-4 text-rose-400" />
                    </motion.div>

                    {}
                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-[1.1]">
                        Give the Gift of{' '}
                        <span className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-rose-500 to-orange-400">
                                Life
                            </span>
                            <motion.span
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary to-rose-400 rounded-full origin-left"
                            />
                        </span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Life Flow connects dedicated blood donors with patients in urgent need.
                        Join our community of heroes — <strong className="text-gray-700">a single donation can save up to three lives.</strong>
                    </motion.p>

                    {}
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-rose-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            Become a Donor
                            <Heart className="w-5 h-5 group-hover:scale-125 transition-transform fill-white/30" />
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-md text-gray-800 border border-gray-200/80 rounded-2xl font-bold text-lg hover:bg-white hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            Request Blood
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                    {}
                    <motion.div variants={itemVariants} className="mt-16 flex flex-wrap justify-center gap-6 md:gap-12">
                        {[
                            { value: '10K+', label: 'Registered Donors' },
                            { value: '500+', label: 'Lives Saved' },
                            { value: '24/7', label: 'Emergency Support' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-400">{stat.value}</div>
                                <div className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {}
            <div className="w-full -mt-2 overflow-hidden leading-none">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
                    <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="url(#waveGrad)" fillOpacity="0.18" />
                    <defs>
                        <linearGradient id="waveGrad" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#e11d48" />
                            <stop offset="1" stopColor="#f97316" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {}
            <motion.section
                variants={sectionVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                className="w-full max-w-6xl px-4 py-20 relative z-10"
            >
                {}
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                        <Droplet className="w-4 h-4 fill-primary" /> Our Services
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Everything You Need,{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-400">In One Place</span>
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-lg">
                        Comprehensive blood management solutions designed to save lives and streamline operations.
                    </p>
                </div>

                {}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className={`group relative rounded-3xl p-7 bg-white border ${s.border} shadow-sm hover:shadow-xl ${s.glow} transition-all duration-400 hover:-translate-y-2 cursor-default overflow-hidden`}
                            >
                                {}
                                <span className="absolute top-4 right-5 text-7xl font-black text-gray-100 select-none leading-none">
                                    {String(i + 1).padStart(2, '0')}
                                </span>

                                {}
                                <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold mb-5 ${s.badgeColor}`}>
                                    {s.badge}
                                </span>

                                {}
                                <div className={`w-14 h-14 ${s.bg} rounded-2xl flex items-center justify-center mb-5 ${s.color} group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                                    <Icon className="w-7 h-7" />
                                </div>

                                <h3 className="text-lg font-bold mb-2 text-gray-800 leading-snug">{s.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.section>

            {}
            <motion.section
                variants={sectionVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                className="w-full max-w-6xl px-4 py-20 relative z-10"
            >
                <div className="rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 md:p-16 relative overflow-hidden shadow-2xl">
                    {}
                    <div className="absolute -top-20 -left-20 w-72 h-72 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-primary/30 to-transparent rounded-full pointer-events-none" />
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-rose-500/20 to-transparent rounded-full pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                        {}
                        <div className="w-full lg:w-1/2">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-semibold mb-6">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> Why Choose Life Flow?
                            </span>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                                Built with Care,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Driven by Purpose</span>
                            </h2>
                            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                                We bring together technology and compassion to create a seamless experience for saving lives.
                            </p>
                            <div className="space-y-4">
                                {[
                                    'Fast & Reliable',
                                    'Community Driven',
                                    'Real-Time Updates',
                                    'Secure & Verified System',
                                    'Easy Registration Process',
                                ].map((feature, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0">
                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <span className="text-gray-200 font-medium">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {}
                        <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
                            {features.map((f, i) => {
                                const FIcon = f.icon;
                                return (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.05, y: -4 }}
                                        className={`${i % 2 !== 0 ? 'mt-6' : ''} bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center gap-3 border border-white/10 hover:bg-white/20 transition-all duration-300 cursor-default`}
                                    >
                                        <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center`}>
                                            <FIcon className={`w-6 h-6 ${f.color}`} />
                                        </div>
                                        <span className="text-white font-semibold text-sm text-center">{f.label}</span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </motion.section>

            {}
            <motion.section
                ref={bottomRef}
                variants={sectionVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                className="w-full max-w-5xl px-4 py-20 text-center relative z-10 mb-10"
            >
                {}
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-8">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-rose-200/30 animate-pulse" />
                    <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center border border-primary/10">
                        <Info className="w-8 h-8 text-primary" />
                    </div>
                </div>

                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
                    About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-400">Life Flow</span>
                </h2>

                <p className="text-xl text-gray-500 leading-relaxed max-w-3xl mx-auto mb-10">
                    Life Flow is a community-driven blood management system.
                    Our mission is to bridge the gap between blood donors and patients in need —
                    making every drop count.
                </p>

                <Link
                    to="/register"
                    className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-primary to-rose-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 group"
                >
                    Join Our Mission
                    <Heart className="w-5 h-5 fill-white/30 group-hover:scale-125 transition-transform" />
                </Link>
            </motion.section>

            {}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-[radial-gradient(ellipse,_var(--tw-gradient-stops))] from-primary/10 to-transparent rounded-full pointer-events-none" />
        </div>
    );
};

export default LandingPage;
