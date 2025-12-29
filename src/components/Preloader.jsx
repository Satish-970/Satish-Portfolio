import { useEffect, useState, useRef } from 'react';
import logoGif from '../assets/logo.gif';
import headerImg from '../assets/images/IMG_6223.jpg';

const Preloader = ({ onLoaded, customText }) => {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');

    // Use custom text if provided, otherwise default
    const fullText1 = customText ? customText[0] : "Forging the Future";
    const fullText2 = customText ? customText[1] : "Code. Innovate. Impact";

    const [isHidden, setIsHidden] = useState(false);

    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        let t1 = '';
        let t2 = '';

        const preloadAssets = async () => {
            // Only preload critical assets for fast initial paint
            const assets = [
                logoGif,
                headerImg
            ];
            const promises = assets.map((src) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = resolve;
                    img.onerror = resolve; // Continue even if one fails
                });
            });
            await Promise.all(promises);
        };

        const runAnimation = async () => {
            // Start asset loading in parallel (fire and forget)
            preloadAssets();

            // Type line 1
            if (fullText1) {
                for (let i = 0; i < fullText1.length; i++) {
                    await new Promise(r => setTimeout(r, 75));
                    t1 += fullText1[i];
                    setText1(t1);
                }
            }

            // Type line 2
            if (fullText2) {
                for (let i = 0; i < fullText2.length; i++) {
                    await new Promise(r => setTimeout(r, 75));
                    t2 += fullText2[i];
                    setText2(t2);
                }
            }

            // DO NOT WAIT for assets. Just finish text and exit.
            // Minimum view time after typing
            await new Promise(r => setTimeout(r, customText ? 2000 : 2000));

            setIsHidden(true);
            setTimeout(() => {
                onLoaded();
            }, 500); // Wait for transition
        };

        runAnimation();
    }, [fullText1, fullText2, onLoaded]);

    if (isHidden) return null;

    return (
        <div className={`preloader ${isHidden ? 'preloader--hidden' : ''}`}>
            <div className="preloader__spinner">
                <img src="/favicon-32x32.png" alt="SP Logo" className="preloader__logo" />
                <div className="preloader__orbit">
                    <span className="preloader__orbit-line"></span>
                    <span className="preloader__orbit-line"></span>
                    <span className="preloader__orbit-line"></span>
                    <span className="preloader__orbit-line"></span>
                    <span className="preloader__orbit-line"></span>
                </div>
            </div>
            <div className="preloader__text">
                <span className="preloader__text-line">{text1}</span>
                <span className="preloader__text-line">{text2}</span>
            </div>
        </div>
    );
};

export default Preloader;
