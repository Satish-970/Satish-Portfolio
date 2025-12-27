import { useState, useEffect } from 'react';

const LazyImage = ({ src, alt, className }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setIsLoaded(true);
    }, [src]);

    return (
        <div className={className} style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Skeleton Placeholder */}
            {!isLoaded && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#e0e0e0',
                        animation: 'pulse 1.5s infinite ease-in-out',
                        borderRadius: 'inherit'
                    }}
                    className="skeleton-loader"
                />
            )}

            {/* Styles for skeleton pulse/shimmer */}
            <style>{`
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 0.8; }
                    100% { opacity: 0.6; }
                }
                .skeleton-loader {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: skeleton-loading 1.5s infinite;
                }
                @keyframes skeleton-loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                [data-theme='dark'] .skeleton-loader {
                    background: linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%);
                }
            `}</style>

            <img
                src={src}
                alt={alt}
                className={className}
                loading="lazy"
                style={{
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out',
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    objectFit: 'cover'
                }}
            />
        </div>
    );
};

export default LazyImage;
