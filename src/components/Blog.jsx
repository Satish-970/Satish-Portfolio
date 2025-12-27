import { useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import blog1 from '../assets/images/{60FD904D-E775-4C9F-9597-3531F8724AA6}.jpg';
import blog2 from '../assets/images/{DCE52A84-3191-4015-8CCE-2FDDD525DD34}.jpg';
import blog3 from '../assets/images/{E642A587-48AE-4394-8BA8-238FCA8EFE85}.jpg';

const Blog = () => {
    useEffect(() => {
        ScrollReveal().reveal(".blog__card", {
            distance: "50px",
            origin: "bottom",
            duration: 1000,
            interval: 500,
            viewFactor: 0.5,
        });
    }, []);

    return (
        <section className="section__container blog__container" id="blog">
            <p className="section__subheader">Blog Posts</p>
            <h2 className="section__header">I Love To Write Articles</h2>
            <div className="blog__grid">
                <div className="blog__card">
                    <img src={blog1} alt="blog" />
                    <p>Change Required in Life</p>
                    <h4>Turning Conversions into Information</h4>
                    <a href="https://satishportfolio.blogspot.com/">Read More</a>
                </div>
                <div className="blog__card">
                    <img src={blog2} alt="blog" />
                    <p>Educational</p>
                    <h4>The Ultimate Power Quantum Computing</h4>
                    <a href="https://satishportfolio.blogspot.com/">Read More</a>
                </div>
                <div className="blog__card">
                    <img src={blog3} alt="blog" />
                    <p>Ai Rewiring</p>
                    <h4>What do you think about AI</h4>
                    <a href="https://satishportfolio.blogspot.com/">Read More</a>
                </div>
            </div>
        </section>
    );
};

export default Blog;
