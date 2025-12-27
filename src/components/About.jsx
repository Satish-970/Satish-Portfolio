import { useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import aboutImg from '../assets/images/IMG_6234.png';

const About = () => {
    useEffect(() => {
        ScrollReveal().reveal(".about__image img", {
            distance: "50px",
            origin: "left",
            duration: 1000,
            viewFactor: 0.5,
        });
        ScrollReveal().reveal(".about__content .section__header", {
            distance: "50px",
            origin: "bottom",
            duration: 1000,
            delay: 500,
        });
        ScrollReveal().reveal(".about__content p", {
            distance: "50px",
            origin: "bottom",
            duration: 1000,
            delay: 1000,
        });
        ScrollReveal().reveal(".about__content h4", {
            distance: "50px",
            origin: "bottom",
            duration: 1000,
            delay: 1500,
        });
        ScrollReveal().reveal(".about__btns", {
            distance: "50px",
            origin: "bottom",
            duration: 1000,
            delay: 2000,
        });
    }, []);
    return (
        <section className="section__container about__container" id="about">
            <div className="about__image">
                <img src={aboutImg} alt="about" loading="lazy" />
            </div>
            <div className="about__content">
                <h2 className="section__header">About me</h2>
                <p>Satish Pakalapati
                    A relentless B.Tech Computer Science student at Lovely Professional University,
                    Mastering the art of Data Science and Digital Marketing with unmatched drive.
                </p>
                <h4>
                    Expertise
                    Fueled by a passion for innovation, Excels at crafting dynamic dashboards and engineering cutting-edge machine learning models.
                    Committed to pushing boundaries, Continuously hones expertise in emerging technologies,
                    Delivering high-impact solutions that redefine what's possible!.
                </h4>
                <div className="about__btns">
                    <a href="/Resume.pdf" target="_blank" className="download__btn" rel="noopener noreferrer">
                        Access My CV
                    </a>
                    <a href="mailto:satishpakalapati65@gmail.com"><i className="ri-mail-fill"></i></a>
                    <a href="https://github.com/Satish-970"><i className="ri-github-fill"></i></a>
                    <a href="https://www.linkedin.com/in/satishpakalapati/"><i className="ri-linkedin-fill"></i></a>
                    <a href="https://satishportfolio.blogspot.com/"><i className="ri-article-fill"></i></a>
                </div>
            </div>
        </section>
    );
};

export default About;
