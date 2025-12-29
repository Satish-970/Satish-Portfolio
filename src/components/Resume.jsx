import { useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import cert1 from '../assets/images/12210470_MOOC_DZU2MXFCertificate_page-0001.jpg';
import cert2 from '../assets/images/12210470_MOOC_7VK5AUXCertificate_page-0001.jpg';
import cert3 from '../assets/images/python_basic certificate_page-0001.jpg';
import cert4 from '../assets/images/12210470_MOOC_PVXX77WCertificate_page-0001.jpg';
import cert5 from '../assets/images/COURSERA_CPP_page-0001.jpg';

const Resume = () => {
    useEffect(() => {
        ScrollReveal().reveal(".testimonial__card", {
            distance: "50px",
            origin: "bottom",
            duration: 1000,
            interval: 500,
            viewFactor: 0.5,
        });
        ScrollReveal().reveal(".testimonial__card1", {
            distance: "50px",
            origin: "bottom",
            duration: 1000
        });
    }, []);

    return (
        <section className="section__container client__container" id="resume">
            <div id="resume-trigger" style={{ position: 'absolute', top: '50%', visibility: 'hidden' }}></div>
            <h2 className="section__subheader">Resume</h2>
            <div className="testimonial__card1">
                <a href="https://www.boardinfinity.com/programs/college-courses"><h3>Summer Training Program</h3></a>
                <div><h3>Board Infinity</h3></div>
                <div><h5> Database Management Systems (DBMS)</h5></div>
                <ul style={{ lineHeight: 1.6, marginBottom: '20px', paddingLeft: '20px' }}>
                    <li>Strong grasp of DBMS evolution and core types.</li>
                    <li>Skilled in ER diagram creation and normalization (1NF–3NF).</li>
                    <li>Proficient in B/B+ Tree indexing for query optimization.</li>
                    <li>In-depth knowledge of transaction management: ACID, serializability, concurrency control.</li>
                </ul>
                <div><h5>SQL Proficiency</h5></div>
                <ul style={{ lineHeight: 1.6, marginBottom: '20px', paddingLeft: '20px' }}>
                    <li>Mastery of DDL, DML, DCL, TCL</li>
                    <li>Advanced querying: WHERE, ORDER BY, regex, string/boolean/grouping functions.</li>
                    <li>Expert in joins, subqueries, GROUP BY, HAVING, UNION, CASE, multi-table queries.</li>
                </ul>
                <div><h5>Relational & Non-Relational Databases</h5></div>
                <ul style={{ lineHeight: 1.6, marginBottom: '20px', paddingLeft: '20px' }}>
                    <li>Proficient in MySQL; clear distinction between SQL and NoSQL systems.</li>
                </ul>
                <h4>Learnt Tech <span>: MySQL, SQL</span></h4>
            </div>

            <h3 className="test">Education</h3>
            <div className="testimonial__grid">
                <div className="testimonial__card">
                    <h2>Btech</h2>
                    <p>2022 - present<br />Lovely Professional University</p>
                    <h4>8.06/10.00</h4>
                </div>
                <div className="testimonial__card">
                    <h2>Intermediate</h2>
                    <p>2020 - 2022<br />DKNP JR College</p>
                    <h4>957/1000</h4>
                </div>
                <div className="testimonial__card">
                    <h2>Secondary</h2>
                    <p>2019 - 2020<br />Sri Siddartha Educational Institutions</p>
                    <h4>10.00/10.00</h4>
                </div>
                <div className="about__btns">
                    <a href="/Resume.pdf" target="_blank" className="download__btn" rel="noopener noreferrer">
                        Download CV
                    </a>
                </div>
            </div>

            <h2 className="section__subheader" style={{ marginTop: '4rem' }}>Certifications / Courses</h2>
            <div className="testimonial__grid">
                <div className="testimonial__card">
                    <h2>NPTEL</h2>
                    <p>
                        <img src={cert1} alt="Certificate" />
                        Earned a prestigious cloud computing certificate from Swayam, an initiative by the Indian Government, unlocking deep expertise in cloud computing technologies and their transformative applications.
                    </p>
                    <a href="https://drive.google.com/file/d/1kXMl26U8M9dGRxv2W_9ZGZ5N3DfTL2JC/view?usp=sharing"><h4>click Here</h4></a>
                </div>
                <div className="testimonial__card">
                    <h2>Coursera - Supervised Learning</h2>
                    <p>
                        <img src={cert2} alt="Certificate" />
                        Earned a Supervised Learning certificate through Coursera, a globally recognized online learning platform offering courses from top universities and institutions.
                    </p>
                    <a href="https://drive.google.com/file/d/10To75UJpChRRsKQdrSanRagJ7EbPhhMp/view?usp=sharing"><h4>click Here</h4></a>
                </div>
                <div className="testimonial__card">
                    <h2>Hacker rank - Python</h2>
                    <p>
                        <img src={cert3} alt="Certificate" />
                        Achieved a Python certification from HackerRank, demonstrating proficiency in core programming concepts and problem-solving skills.
                    </p>
                    <a href="https://www.hackerrank.com/certificates/b18906a3a19c"><h4>click Here</h4></a>
                </div>
                <div className="testimonial__card">
                    <h2>Coursera - Tableau</h2>
                    <p>
                        <img src={cert4} alt="Certificate" />
                        Completed a Tableau course on Coursera, gaining hands-on experience in data visualization, dashboard creation, and interactive analytics.
                    </p>
                    <a href="https://drive.google.com/file/d/1wL3HxfTMfYB-OstuJikaRAdDZVYf3-s3/view?usp=sharing"><h4>click Here</h4></a>
                </div>
                <div className="testimonial__card">
                    <h2>Coursera - C++</h2>
                    <p>
                        <img src={cert5} alt="Certificate" />
                        Completed a C++ programming course on Coursera, covering object-oriented principles, data structures, and algorithmic problem solving.
                    </p>
                    <a href="https://drive.google.com/file/d/1jjIG6ASvM0bo2-P_SIURsjUvIwdd348o/view?usp=sharing"><h4>click Here</h4></a>
                </div>
            </div>
        </section>
    );
};

export default Resume;
