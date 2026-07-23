import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section__container client__container" id="resume" *ngIf="showOnly === 'resume'">
      <h2 class="section__header">Experience & <span>Education</span></h2>

      <h3 class="test">Work Experience</h3>
      <article class="testimonial__card1">
        <div class="resume-card__top">
          <div>
            <h3>Program Analyst Trainee (Intern)</h3>
            <h3 class="resume-org">Cognizant &mdash; <span>Full Stack Java Engineering</span></h3>
          </div>
          <span class="resume-date">Jan 2026 &nda
          sh; May 2026</span>
        </div>
        <h5>Full Stack Java Developer Intern Details</h5>
        <ul>
          <li>Completed structured Full Stack Java Engineer training covering Spring Boot, Hibernate, REST APIs, and microservices architecture.</li>
          <li>Collaborated in a 6-member Agile team to deliver the CityCare platform across 4 sprints of 15 days each using Jira for tracking.</li>
          <li>Containerized services using Docker and managed Git-based collaborative workflows.</li>
          <li>Completed corporate behavioral training focused on workplace communication and teamwork.</li>
        </ul>
        <h4>Learnt Tech<span>: Java, Spring Boot, Hibernate, REST APIs, Docker, Git, Jira</span></h4>
      </article>

      <h3 class="test">Summer Training</h3>
      <article class="testimonial__card1">
        <div class="resume-card__top">
          <div>
            <a href="https://www.boardinfinity.com/programs/college-courses" target="_blank" rel="noopener noreferrer"><h3>Data Analyst Intern</h3></a>
            <h3 class="resume-org">Board Infinity <span>DBMS & SQL</span></h3>
          </div>
          <a href="/Resume.pdf" target="_blank" class="download__btn" rel="noopener noreferrer"><i class="ri-download-2-line"></i>Download CV</a>
        </div>
        <h5>Database Management Systems & SQL Proficiency</h5>
        <ul>
          <li>Mastered DBMS concepts including ER diagrams, normalization (1NF-3NF), and B/B+ Tree query optimization.</li>
          <li>Gained expertise in transaction management (ACID, serializability, concurrency control) and optimized structures.</li>
          <li>Proficient in SQL operations (joins, subqueries, grouping, CASE statements) using MySQL, PostgreSQL, and Oracle.</li>
        </ul>
        <h4>Learnt Tech<span>: MySQL, Oracle SQL, PostgreSQL, SQL</span></h4>
      </article>

      <h3 class="test">Education</h3>
      <div class="testimonial__grid">
        <article class="testimonial__card"><h2>B.Tech</h2><p>2022 - Present<br />Lovely Professional University</p><h4>CGPA: 8.24 / 10.00</h4></article>
        <article class="testimonial__card"><h2>Intermediate</h2><p>2020 - 2022<br />DKNP JR College</p><h4>Percentage: 96%</h4></article>
        <article class="testimonial__card"><h2>Secondary</h2><p>2019 - 2020<br />Sri Siddartha Educational Institutions</p><h4>Percentage: 97%</h4></article>
      </div>

      <h3 class="test">Achievements</h3>
      <article class="testimonial__card1">
        <ul style="padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.6rem; color: var(--text-muted);">
          <li>Participated in Code-a-Haunt coding competition (codingblocks.com)</li>
          <li>Participated in a Data Science Workshop (cbgo.live)</li>
        </ul>
      </article>
    </section>

    <section class="section__container" id="certifications" *ngIf="showOnly === 'certifications'">
      <h2 class="section__header">Certifications & <span>Courses</span></h2>
      <div class="cert__grid">
        <article class="cert__card" *ngFor="let cert of certificates">
          <div class="cert__card-logo">{{ cert[0] }}</div>
          <img class="cert__card-img" [src]="cert[1]" [alt]="cert[0] + ' certificate'" />
          <p class="cert__card-desc">{{ cert[2] }}</p>
          <a class="cert__card-link" [href]="cert[3]" target="_blank" rel="noopener noreferrer">View Certificate <i class="ri-arrow-right-line"></i></a>
        </article>
      </div>
    </section>
  `,
})
export class ResumeComponent {
  @Input() showOnly: 'resume' | 'certifications' = 'resume';

  readonly certificates = [
    ['NPTEL', 'assets/images/12210470_MOOC_DZU2MXFCertificate_page-0001.jpg', 'Cloud Computing: Swayam cloud technology foundations certificate.', 'https://drive.google.com/file/d/1kXMl26U8M9dGRxv2W_9ZGZ5N3DfTL2JC/view?usp=sharing'],
    ['Coursera', 'assets/images/12210470_MOOC_7VK5AUXCertificate_page-0001.jpg', 'Supervised Machine Learning: Regression and Classification from Coursera.', 'https://drive.google.com/file/d/10To75UJpChRRsKQdrSanRagJ7EbPhhMp/view?usp=sharing'],
    ['Coursera', 'assets/images/12210470_MOOC_PVXX77WCertificate_page-0001.jpg', 'Data Visualization and Data Analysis course covering Tableau and analytics.', 'https://drive.google.com/file/d/1wL3HxfTMfYB-OstuJikaRAdDZVYf3-s3/view?usp=sharing'],
    ['Spring Board', 'assets/images/genai.jpg', 'Principles of Gen AI certificate from Spring Board.', ''],
    ['Coursera', 'assets/images/excel.jpg', 'Excel Skills for Data Analytics and Visualization from Coursera.', ''],
    ['HackerRank', 'assets/images/python_basic certificate_page-0001.jpg', 'Python certification showing core programming and problem-solving skills.', 'https://www.hackerrank.com/certificates/b18906a3a19c'],
  ];
}
