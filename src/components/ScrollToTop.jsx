import { useState, useEffect } from 'react';

const ScrollToTop = ({ onRefresh }) => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled upto given distance
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Trigger preloader and scroll to top
    const handleClick = () => {
        if (onRefresh) {
            onRefresh();
        } else {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <>
            {isVisible && (
                <div
                    onClick={handleClick}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '20px', // Positioning on left to avoid bot overlap
                        zIndex: 999,
                        cursor: 'pointer',
                        backgroundColor: 'var(--primary-color)',
                        color: 'var(--white)',
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                        transition: 'transform 0.3s ease, background-color 0.3s ease'
                    }}
                    className="scroll-to-top"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.backgroundColor = 'var(--primary-color-dark)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                    }}
                >
                    <i className="ri-arrow-up-line" style={{ fontSize: '1.5rem' }}></i>
                </div>
            )}
        </>
    );
};

export default ScrollToTop;
