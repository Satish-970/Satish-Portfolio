import { motion, useScroll, useSpring } from "framer-motion";



const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <>
            {/* Background container for the progress bar (optional, makes it look like a track) */}
            <div
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "transparent",
                    zIndex: 10000,
                    pointerEvents: "none",
                }}
            >
                {/* The actual filling bar */}
                <motion.div
                    style={{
                        scaleX,
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "100%",
                        background: "var(--primary-color-dark, #ee9821)", // Use darker theme color
                        boxShadow: "none",
                        filter: "brightness(0.8)", // Make it a bit darker
                        transformOrigin: "0%",
                    }}
                />
            </div>
        </>
    );
};

export default ScrollProgress;
