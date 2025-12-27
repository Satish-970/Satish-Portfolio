import { useState, useEffect } from "react";
import logoGif from "../assets/logo.gif";
import "../logo_styles.css";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

const RevealText = ({ text }) => {
    return (
        <div style={{ position: 'relative', overflow: 'hidden', height: '1.2em', lineHeight: '1.2em' }}>
            <motion.div
                variants={{
                    hover: { y: "-50%" },
                    initial: { y: "0%" }
                }}
                transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                <span>{text}</span>
                <span className="text-primary-dark">{text}</span>
            </motion.div>
        </div>
    );
}

const Navbar = ({ onRefresh, onLogoClick, isTourActive }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState("light");

    // Removed Smart Scroll logic to keep navbar fixed always

    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
    }, [theme]);

    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const sections = document.querySelectorAll('section[id], header[id]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, {
            threshold: 0,
            rootMargin: "-50% 0px -50% 0px" // Trigger exactly at center
        });

        sections.forEach(section => observer.observe(section));

        return () => sections.forEach(section => observer.unobserve(section));
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const navLinks = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'resume', label: 'Resume' },
        { id: 'project', label: 'Projects' },
        { id: 'service', label: 'Skills' },
        { id: 'blog', label: 'Blog' },
        { id: 'contact', label: 'Contact', isBtn: true },
    ];

    return (
        <nav className="navbar-futuristic">
            <div className="nav__bar">
                <div className="nav__header">
                    <div className="nav__logo">
                        <a href="#home" className="nav-logo-link" onClick={(e) => {
                            if (onLogoClick) {
                                e.preventDefault();
                                onLogoClick();
                            }
                        }}>
                            <img
                                src={logoGif}
                                alt="Satish Pakalapati"
                                className={`nav-logo-gif ${isTourActive ? 'nav-logo-rotating' : ''}`}
                            />
                            {isTourActive && <span className="nav-tour-text">Click to Stop</span>}
                        </a>
                    </div>
                    <div
                        className="nav__menu__btn"
                        id="menu-btn"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span><i className={isOpen ? "ri-close-line" : "ri-menu-3-line"}></i></span>
                    </div>
                </div>
                <ul className={`nav__links ${isOpen ? "open" : ""}`} id="nav-links">
                    {navLinks.map((link) => (
                        <li key={link.id} className={`link ${link.isBtn ? 'btn' : ''} ${activeSection === link.id ? 'active' : ''}`}>
                            <motion.a
                                href={`#${link.id}`}
                                onClick={() => { setIsOpen(false); if (link.id === 'home' && onRefresh) onRefresh(); }}
                                className="relative link-item block"
                                initial="initial"
                                whileHover="hover"
                            >
                                <span className="relative z-10 block">
                                    <RevealText text={link.label} />
                                </span>
                                {activeSection === link.id && (
                                    <motion.span
                                        className="active-line"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    />
                                )}
                            </motion.a>
                        </li>
                    ))}
                    <li className="theme-toggle" onClick={toggleTheme}>
                        <i className={theme === "light" ? "ri-moon-line theme-icon" : "ri-sun-line theme-icon"}></i>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
