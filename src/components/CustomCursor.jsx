import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
    const cursorRef = useRef(null); // The ring (follower)
    const dotRef = useRef(null);    // The dot (leader)
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        const dot = dotRef.current;

        if (!cursor || !dot) return;

        let mouseX = -100; // Start off-screen
        let mouseY = -100;
        let cursorX = 0;
        let cursorY = 0;

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Dot follows immediately (Leader)
            dot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
        };

        const animate = () => {
            // Ring follows with linear interpolation (Follower)
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;

            cursorX += dx * 0.15; // Smooth factor
            cursorY += dy * 0.15;

            cursor.style.transform = `translate3d(${cursorX - 12}px, ${cursorY - 12}px, 0)`;

            requestAnimationFrame(animate);
        };

        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        // Add hover listeners to all interactive elements
        const clickables = document.querySelectorAll('a, button, input, textarea, .clickable');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        const showCursor = () => {
            cursor.classList.remove('cursor--hidden');
            dot.classList.remove('cursor--hidden');
        }
        const hideCursor = () => {
            cursor.classList.add('cursor--hidden');
            dot.classList.add('cursor--hidden');
        }

        window.addEventListener('mousemove', onMouseMove);
        document.body.addEventListener('mouseenter', showCursor);
        document.body.addEventListener('mouseleave', hideCursor);

        const animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            document.body.removeEventListener('mouseenter', showCursor);
            document.body.removeEventListener('mouseleave', hideCursor);
            cancelAnimationFrame(animationId);

            clickables.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, []);

    // Re-attach listeners when DOM might change (optional/simple version)
    useEffect(() => {
        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        const clickables = document.querySelectorAll('a, button, input, textarea, .clickable');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            clickables.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
        }
    });

    return (
        <>
            <div
                className={`custom-cursor ${isHovering ? 'cursor--hover' : ''}`}
                ref={cursorRef}
            ></div>
            <div
                className={`cursor-dot ${isHovering ? 'cursor--hover' : ''}`}
                ref={dotRef}
            ></div>
        </>
    );
};

export default CustomCursor;
