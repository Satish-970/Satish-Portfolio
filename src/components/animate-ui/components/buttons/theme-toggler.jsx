
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { flushSync } from 'react-dom';
import './theme-toggler.css';

export const ThemeTogglerButton = ({
    size = 'default',
    variant = 'default',
    modes = ['light', 'dark'],
    onThemeChange,
    currentTheme = 'light'
}) => {

    const toggleTheme = async (e) => {
        const nextIndex = (modes.indexOf(currentTheme) + 1) % modes.length;
        const nextMode = modes[nextIndex];

        // Fallback if browser doesn't support View Transitions
        if (!document.startViewTransition) {
            if (onThemeChange) {
                onThemeChange(nextMode);
            }
            return;
        }

        const x = e.clientX;
        const y = e.clientY;

        const right = window.innerWidth - x;
        const bottom = window.innerHeight - y;
        const maxRadius = Math.hypot(Math.max(x, right), Math.max(y, bottom));

        const transition = document.startViewTransition(() => {
            if (onThemeChange) {
                flushSync(() => {
                    onThemeChange(nextMode);
                });
            }
        });

        await transition.ready;

        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${maxRadius}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration: 700,
                easing: "ease-in-out",
                pseudoElement: "::view-transition-new(root)",
            }
        );
    };

    return (
        <button
            onClick={toggleTheme}
            className={`theme-toggler-btn ${size} ${variant}`}
            aria-label="Toggle theme"
            type="button"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={currentTheme}
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    className="theme-toggler-icon-wrapper"
                >
                    {currentTheme === 'light' ? (
                        <i className="ri-sun-line theme-icon-sun"></i>
                    ) : currentTheme === 'dark' ? (
                        <i className="ri-moon-line theme-icon-moon"></i>
                    ) : (
                        <i className="ri-computer-line theme-icon-system"></i>
                    )}
                </motion.div>
            </AnimatePresence>
        </button>
    );
}
