import { useState, useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import { motion, AnimatePresence } from 'framer-motion';
import LazyImage from './LazyImage';

import bitcoinGif from '../assets/images/bitcoin.gif';
import dashboardGif from '../assets/images/dashboard.gif';
import marketingGif from '../assets/images/marketing.gif';
import javaGif from '../assets/images/java.gif';
import portfolioGif from '../assets/images/portfoliogif.gif';
import sqlGif from '../assets/images/sql.gif';

const Projects = () => {
    useEffect(() => {
        ScrollReveal().reveal(".project__header", {
            distance: "50px",
            origin: "bottom",
            duration: 1000,
            delay: 500,
            viewFactor: 0.5,
        });
    }, []);

    const [filter, setFilter] = useState('all');

    const projects = [
        {
            id: 1,
            category: 'data',
            imgUrl: bitcoinGif,
            title: 'Bitcoin Close Price',
            details: [
                'Aims to analyze and predict Bitcoin prices using historical data',
                'Involves data preprocessing',
                'Includes exploratory analysis',
                'Uses machine learning with Linear Regression to predict future Bitcoin prices'
            ],
            githubUrl: 'https://github.com/Satish-970/Bitcoin-price',
            btnText: 'View on GitHub'
        },
        {
            id: 2,
            category: 'viz',
            imgUrl: dashboardGif,
            title: 'Data Science Job Salary Analysis',
            details: [
                'Analyzes employment data using Tableau',
                'Creates interactive visualizations',
                'Explores relationships between salary, job titles, experience levels, company locations, and employment types',
                'Provides insights into global salary trends and employment patterns'
            ],
            githubUrl: 'https://github.com/Satish-970/DataSciencejobsAnalysis',
            btnText: 'View on GitHub'
        },
        {
            id: 3,
            category: 'data',
            imgUrl: sqlGif,
            title: 'Query Based Analysis - SQL',
            details: [
                'Showcases SQL skills through real-world HR data analysis',
                'Focuses on employees, departments, salaries, and job roles',
                'Uses a relational HR database for practical use cases',
                'Demonstrates joins, subqueries, aggregations, and logic-based queries',
                'Aims to derive actionable HR insights through efficient SQL querying'
            ],
            githubUrl: 'https://github.com/Satish-970/SQL',
            btnText: 'View on GitHub'
        },
        {
            id: 4,
            category: 'web',
            imgUrl: javaGif,
            title: 'DevHub - Java Full Stack',
            details: [
                'Developed a secure backend using Spring Boot and Hibernate / JPA for efficient data persistence with MySQL',
                'Implemented JWT-based Authentication & Authorization (Spring Security) for secure user sessions',
                'Built a responsive React.js frontend with Redux for state management and Axios for API integration',
                'Designed robust RESTful APIs to handle posts, comments, and real-time user interactions'
            ],
            githubUrl: 'https://github.com/Satish-970/DevHub-JavaFullStack',
            btnText: 'View on GitHub'
        },
        {
            id: 5,
            category: 'web',
            imgUrl: portfolioGif,
            title: 'Personal Portfolio',
            details: [
                'Engineered a high-performance interactive UI using React and Framer Motion for complex animations',
                'Implemented a physics-based Custom Cursor with trailing lag effect and magnetic hover interactions',
                'Developed a smart active navigation system using IntersectionObserver for precise scroll tracking',
                'Optimized performance with lazy-loaded assets and dynamic GIF previews for an engaging UX'
            ],
            githubUrl: 'https://github.com/Satish-970/portfolio',
            btnText: 'View on GitHub'
        },
        {
            id: 6,
            category: 'marketing',
            imgUrl: marketingGif,
            title: 'Digital Marketing',
            details: [
                'Improved online presence through Google Analytics, SEO, and Google Ads',
                'Tracked and optimized site performance using Google Analytics',
                'Researched high-impact keywords via SEMrush and Google Keyword Planner',
                'Conducted SEO audits and resolved issues to boost search rankings',
                'Managed and optimized Google Ads campaigns for better ROI'
            ],
            githubUrl: 'https://docs.google.com/document/d/1uYv0ruzVb0YY0XzTCK4ax1l2G-x90ENx/edit?usp=sharing&ouid=117247420458496169293&rtpof=true&sd=true',
            btnText: 'View Details'
        }
    ];

    const filteredProjects = filter === 'all'
        ? projects
        : projects.filter(p => p.category === filter);

    return (
        <section className="section__container project__container" id="project">
            <div className="project__header">
                <h2 className="section__header">My Projects</h2>
                <div className="project__nav">
                    <button
                        className={`btn project__btn ${filter === 'all' ? 'mixitup-control-active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`btn project__btn ${filter === 'web' ? 'mixitup-control-active' : ''}`}
                        onClick={() => setFilter('web')}
                    >
                        Web Dev
                    </button>
                    <button
                        className={`btn project__btn ${filter === 'data' ? 'mixitup-control-active' : ''}`}
                        onClick={() => setFilter('data')}
                    >
                        Data Analysis
                    </button>
                    <button
                        className={`btn project__btn ${filter === 'viz' ? 'mixitup-control-active' : ''}`}
                        onClick={() => setFilter('viz')}
                    >
                        Data Viz
                    </button>
                    <button
                        className={`btn project__btn ${filter === 'marketing' ? 'mixitup-control-active' : ''}`}
                        onClick={() => setFilter('marketing')}
                    >
                        Marketing
                    </button>
                </div>
            </div>
            <motion.div layout className="project__grid">
                <AnimatePresence>
                    {filteredProjects.map(project => (
                        <motion.div
                            layout
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className={`project__card mix ${project.category}`}
                        >
                            <a href={project.githubUrl}>
                                <div>
                                    <LazyImage src={project.imgUrl} alt="project" className="project__image" />
                                </div>
                            </a>
                            <h4 style={{ margin: '15px 0' }}>{project.title}</h4>
                            <ul style={{ lineHeight: 1.6, marginBottom: '20px', paddingLeft: '20px' }}>
                                {project.details.map((detail, index) => (
                                    <li key={index}>{detail}</li>
                                ))}
                            </ul>
                            <a href={project.githubUrl} className="project__link-wrapper">
                                <button className="project__link-btn">
                                    {project.btnText}
                                </button>
                            </a>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </section>
    );
};

export default Projects;
