import { useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import headerImg from '../assets/images/IMG_6223.jpg';

const Hero = () => {
    useEffect(() => {
        const scrollRevealOption = {
            distance: "50px",
            origin: "bottom",
            duration: 1000,
            viewFactor: 0.5,
        };

        ScrollReveal().reveal(".header__image img", { ...scrollRevealOption });
        ScrollReveal().reveal(".header__content h4", { ...scrollRevealOption, delay: 500 });
        ScrollReveal().reveal(".header__content h1", { ...scrollRevealOption, delay: 1000 });
        ScrollReveal().reveal(".header__content p", { ...scrollRevealOption, delay: 1500 });
        ScrollReveal().reveal(".header__content .btn", { ...scrollRevealOption, delay: 2000 });
        ScrollReveal().reveal(".header__socials a", { ...scrollRevealOption, interval: 200, delay: 2500 });
    }, []);
    return (
        <header className="header" id="home">
            <div className="section__container header__container">
                <div className="header__image">
                    <img src={headerImg} alt="header" loading="lazy" />
                </div>
                <div className="header__content">
                    <h4>Crafting Digital Excellence</h4>
                    <h1>Hi, This is <span className="aurora-name">Satish Pakalapati</span></h1>
                    <p>
                        A dynamic Data Analyst and developer,
                        Fiercely dedicated to unlocking insights through data and driving AI-powered breakthroughs.
                        With relentless self-motivation and unparalleled adaptability, Fuses razor-sharp analytical
                        prowess with cutting-edge development expertise, Tirelessly crafting smarter, High-impact solutions
                        that redefine efficiency and innovation.
                    </p>
                    <a href="mailto:satishpakalapati65@gmail.com" className="btn">Hire Me Now</a>
                </div>
            </div>
            <div className="header__socials">
                <a href="mailto:satishpakalapati65@gmail.com"><i className="ri-mail-fill"></i></a>
                <a href="https://github.com/Satish-970"><i className="ri-github-fill"></i></a>
                <a href="https://www.linkedin.com/in/satishpakalapati/"><i className="ri-linkedin-fill"></i></a>
                <a href="https://satishportfolio.blogspot.com/"><i className="ri-article-fill"></i></a>
            </div>
        </header>
    );
};

export default Hero;
