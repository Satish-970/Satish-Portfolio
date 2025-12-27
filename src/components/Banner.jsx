import { useEffect } from 'react';
import ScrollReveal from 'scrollreveal';

const Banner = () => {
    useEffect(() => {
        ScrollReveal().reveal(".banner__card", {
            distance: "50px",
            origin: "bottom",
            duration: 1000,
            interval: 500,
            delay: 500,
            viewFactor: 0.5,
        });
    }, []);
    return (
        <section className="section__container banner__container">
            <div className="banner__card">
                <span><i className="ri-pen-nib-line"></i></span>
                <div>
                    <h4>Vision in Action</h4>
                    <p>
                        A relentless imagination drives every decision — igniting exploration, creation, and mastery in every pursuit.
                    </p>
                </div>
            </div>
            <div className="banner__card">
                <span><i className="ri-layout-masonry-line"></i></span>
                <div>
                    <h4>Build with Purpose</h4>
                    <p>
                        Forged digital solutions by fusing analytical rigor with creative brilliance — from data to design, built with unwavering purpose and precision.
                    </p>
                </div>
            </div>
            <div className="banner__card">
                <span><i className="ri-checkbox-line"></i></span>
                <div>
                    <h4>Quality, Always</h4>
                    <p>
                        Committed to flawless, dependable builds — every project meticulously tested, refined, and optimized for maximum impact.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Banner;
