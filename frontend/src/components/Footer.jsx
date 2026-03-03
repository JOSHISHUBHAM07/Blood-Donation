const Footer = () => {
    return (
        <footer className="mt-auto bg-white/30 backdrop-blur-sm border-t border-white/40 py-8 relative z-10 transition-colors duration-300 hover:bg-white/40">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-gray-700 font-medium font-sans drop-shadow-sm">
                    &copy; {new Date().getFullYear()} <span className="text-primary font-semibold">Life Flow</span>. Share Life, Give Blood.
                </p>
                <p className="text-xs mt-2 text-gray-500 font-medium tracking-wide">
                    Built for emergency blood donation connectivity.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
