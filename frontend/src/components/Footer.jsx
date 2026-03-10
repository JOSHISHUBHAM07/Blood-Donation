import { Link } from 'react-router-dom';
import { Droplet, Heart, Mail, Github, Shield } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="mt-auto relative z-10 bg-white/20 backdrop-blur-sm border-t border-white/40">
            <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Droplet className="w-6 h-6 fill-primary stroke-primary" />
                            <span className="text-lg font-extrabold text-gray-800 tracking-tight">Life Flow</span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Connecting blood donors with patients in critical need. Every drop counts. Every second matters.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
                            <li><Link to="/register" className="hover:text-primary transition-colors">Register as Donor / Patient</Link></li>
                        </ul>
                    </div>

                    {/* Info */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">About</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-rose-400" />Secure & Encrypted</li>
                            <li className="flex items-center gap-2"><Heart className="w-4 h-4 text-rose-400" />Built for Emergency Response</li>
                            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-rose-400" />support@lifeflow.app</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200/60 pt-5 flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-400 font-medium">
                        &copy; {new Date().getFullYear()} <span className="text-primary font-semibold">Life Flow</span>. Share Life, Give Blood.
                    </p>
                    <p className="text-xs text-gray-400">
                        Made with <Heart className="inline w-3 h-3 text-rose-400 fill-rose-400" /> for a healthier world
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
