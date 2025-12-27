import { useEffect } from 'react';
import ScrollReveal from 'scrollreveal';

const Skills = () => {
    useEffect(() => {
        ScrollReveal().reveal(".service__card", {
            duration: 1000,
            interval: 500,
            viewFactor: 0.5,
        });
    }, []);

    return (
        <section className="section__container service__container" id="service">
            <p className="section__subheader">🛠 Skills & Technologies</p>
            <h2 className="section__header">What Do I Learn?</h2>
            <p className="section__description">
                Specialized in programming, data visualization, and cutting-edge digital technologies, expertly analyzing and conveying insights with precision and impact.
            </p>
            <div className="service__grid">
                <div className="service__card">
                    <span><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" width="40" /></span>
                    <h4>Python</h4>
                </div>
                <div className="service__card">
                    <span><img src="https://www.admecindia.co.in/wp-content/uploads/2015/10/admec-internal-Loops-in-C-and-C.jpg" alt="C/C++" width="40" /></span>
                    <h4>C/C++</h4>
                </div>
                <div className="service__card">
                    <span><img src="https://static.vecteezy.com/system/resources/previews/051/336/407/non_2x/java-programming-transparent-logo-free-png.png" alt="Java" width="40" /></span>
                    <h4>Java</h4>
                </div>
                <div className="service__card">
                    <span><img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Rlogo.png" alt="R" width="40" /></span>
                    <h4>R Language</h4>
                </div>
                <div className="service__card">
                    <span><img src="https://www.rogersoft.com/storage/attachments/1694676692.jpg" alt="SQL" width="40" /></span>
                    <h4>SQL</h4>
                </div>
                <div className="service__card">
                    <span><img src="https://img.icons8.com/color/48/000000/tableau-software.png" alt="Tableau Prep" width="40" /></span>
                    <h4>Tableau Prep</h4>
                </div>
                <div className="service__card">
                    <span><img src="https://img.icons8.com/color/48/000000/google-ads.png" alt="Google Ads" width="40" /></span>
                    <h4>SEO & Analytics</h4>
                    <p>Google Ads, SEMrush</p>
                </div>
                <div className="service__card">
                    <span><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="MySQL" width="40" /></span>
                    <h4>MySQL</h4>
                </div>
                <div className="service__card">
                    <span><img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjK8c4bgTWytBoJtUXN7cdSh4Jk2ROi9Zu3_v-jrrrb6-saAlAJCj6mDNbIHm-lWOOu1QfpiqWZCJUZrio3wYfmSNPDYw1bJbx2RZZySgZigF5q5qYg8ISXMPNYDi_6siZar5pJf31KDWl6/s1600/oracle.png" alt="Oracle" width="40" /></span>
                    <h4>Oracle</h4>
                </div>
                <div className="service__card">
                    <span><img src="https://miro.medium.com/v2/resize:fit:786/format:webp/0*UcvDXUMq8onpVRZO.png" alt="Tableau Desktop" width="50" /></span>
                    <h4>Tableau Desktop</h4>
                </div>
                <div className="service__card">
                    <span><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hadoop/hadoop-original.svg" alt="Apache" width="40" /></span>
                    <h4>Apache</h4>
                    <p>Hadoop, Hive, Hbase, Pig</p>
                </div>
                <div className="service__card">
                    <span><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Jupyter_logo.svg/1200px-Jupyter_logo.svg.png" alt="Jyputer" width="40" /></span>
                    <h4>Jupyter Notebook</h4>
                    <p>Python Libraries, Data Visualization</p>
                </div>
                <div className="service__card">
                    <span><img src="https://images.icon-icons.com/3685/PNG/512/github_logo_icon_229278.png" alt="GitHub" width="40" /></span>
                    <h4>Version Control</h4>
                    <p>Git, GitHub</p>
                </div>
            </div>
        </section>
    );
};

export default Skills;
