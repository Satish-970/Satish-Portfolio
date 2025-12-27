import { useState, useEffect, useRef, Suspense } from 'react';

const LazyLoadSection = ({ children, placeholderHeight = '500px' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Trigger when 10% of the placeholder is visible 
                // OR if it's close to the viewport (rootMargin)
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '100px', // Start loading 100px before it comes into view
                threshold: 0.1
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, []);

    return (
        <div ref={sectionRef} style={{ minHeight: isVisible ? 'auto' : placeholderHeight }}>
            {isVisible ? (
                <Suspense fallback={<div style={{ height: placeholderHeight, background: 'transparent' }}></div>}>
                    {children}
                </Suspense>
            ) : (
                <div style={{ height: placeholderHeight, width: '100%' }}></div>
            )}
        </div>
    );
};

export default LazyLoadSection;
