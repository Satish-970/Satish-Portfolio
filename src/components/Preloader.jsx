import { useEffect, useState } from 'react';

const Preloader = ({ onLoaded, customText }) => {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');

    // Use custom text if provided, otherwise default
    const fullText1 = customText ? customText[0] : "Forging the Future";
    const fullText2 = customText ? customText[1] : "Code. Innovate. Impact";

    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        let t1 = '';
        let t2 = '';

        const runAnimation = async () => {
            // Type line 1
            if (fullText1) {
                for (let i = 0; i < fullText1.length; i++) {
                    await new Promise(r => setTimeout(r, 40)); // Slightly faster typing for custom text maybe? kept 40-60
                    t1 += fullText1[i];
                    setText1(t1);
                }
            }

            // Type line 2
            if (fullText2) {
                for (let i = 0; i < fullText2.length; i++) {
                    await new Promise(r => setTimeout(r, 40));
                    t2 += fullText2[i];
                    setText2(t2);
                }
            }

            // Wait, then fade
            // Increase wait time significantly if custom text is used (likely for the tour)
            // or just generally to allow reading. 2500ms is good for "Initializing..."
            await new Promise(r => setTimeout(r, customText ? 2500 : 800));
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
