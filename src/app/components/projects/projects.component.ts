import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Project {
  id: number;
  category: string;
  image: string;
  title: string;
  details: string[];
  link: string;
  tag: string;
  button: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section__container project__container" id="project">
      <div class="project__header">
        <div>
          <div class="section__tag">Portfolio</div>
          <h2 class="section__header">Featured <span>Projects</span></h2>
        </div>
        <div class="project__nav">
          <button type="button" class="project__btn" *ngFor="let item of filters" [class.mixitup-control-active]="filter === item.key" (click)="filter = item.key">
            {{ item.label }}
          </button>
        </div>
      </div>

      <div class="project__grid">
        <article class="project__card" *ngFor="let project of filteredProjects">
          <a [href]="project.link" target="_blank" rel="noopener noreferrer">
            <img class="project__image" [src]="project.image" [alt]="project.title" />
          </a>
          <div class="project__card-body">
            <div class="project-card__heading">
              <h4>{{ project.title }}</h4>
              <span>{{ project.tag }}</span>
            </div>
            <ul>
              <li *ngFor="let detail of project.details">{{ detail }}</li>
            </ul>
            <a [href]="project.link" target="_blank" rel="noopener noreferrer" class="project__link-wrapper">
              <button class="project__link-btn" type="button"><i class="ri-github-fill"></i>{{ project.button }}</button>
            </a>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class ProjectsComponent {
  filter = 'all';

  readonly filters = [
    { key: 'all', label: 'All' },
    { key: 'web', label: 'Web Dev' },
    { key: 'data', label: 'Data Analysis' },
    { key: 'viz', label: 'Data Viz' },
    { key: 'marketing', label: 'Marketing' },
  ];

  readonly projects: Project[] = [
    {
      id: 7,
      category: 'web',
      image: 'assets/images/java.gif',
      title: 'CityCare – Healthcare and Emergency Response',
      details: [
        'Engineered an 8-module municipal full-stack healthcare platform (Access, Citizen, Facility, Emergency, Compliance, Reporting, Notifications).',
        'Built REST API microservices with Spring Boot and Hibernate ORM against relational MySQL/PostgreSQL databases.',
        'Developed interactive React dashboards for 6 distinct user roles under an Agile workflow.'
      ],
      link: 'https://github.com/Satish-970',
      tag: 'Java / React / Microservices',
      button: 'View Repository',
    },
    {
      id: 1,
      category: 'data',
      image: 'assets/images/bitcoin.gif',
      title: 'Bitcoin Close Price Predictor',
      details: ['Analyzes and predicts Bitcoin prices using historical data.', 'Covers preprocessing, exploratory analysis, and machine learning.', 'Uses Linear Regression to support investment-oriented insights.'],
      link: 'https://github.com/Satish-970/Bitcoin-price',
      tag: 'ML / Python',
      button: 'View on GitHub',
    },
    {
      id: 2,
      category: 'viz',
      image: 'assets/images/dashboard.gif',
      title: 'Data Science Salary Analysis',
      details: ['Analyzes employment data using Tableau.', 'Explores salaries by role, experience, location, and employment type.', 'Builds visual narratives around global salary patterns.'],
      link: 'https://github.com/Satish-970/DataSciencejobsAnalysis',
      tag: 'Tableau',
      button: 'View on GitHub',
    },
    {
      id: 3,
      category: 'data',
      image: 'assets/images/sql.gif',
      title: 'Query Based HR Analysis',
      details: ['Demonstrates SQL with practical HR analysis use cases.', 'Uses joins, subqueries, aggregations, and logical queries.', 'Focuses on employees, departments, salaries, and roles.'],
      link: 'https://github.com/Satish-970/SQL',
      tag: 'SQL',
      button: 'View on GitHub',
    },
    {
      id: 4,
      category: 'web',
      image: 'assets/images/java.gif',
      title: 'DevHub Java Full Stack',
      details: ['Spring Boot and Hibernate/JPA backend with MySQL persistence.', 'JWT authentication and authorization using Spring Security.', 'Responsive React frontend with Redux and Axios integration.'],
      link: 'https://github.com/Satish-970/DevHub-JavaFullStack',
      tag: 'Java / React',
      button: 'View on GitHub',
    },
    {
      id: 5,
      category: 'web',
      image: 'assets/images/portfoliogif.gif',
      title: 'Personal Portfolio',
      details: ['Built a high-performance interactive UI with polished motion.', 'Implemented responsive navigation and a playful visual experience.', 'Optimized portfolio assets and project previews for a smooth UX.'],
      link: 'https://github.com/Satish-970/portfolio',
      tag: 'Portfolio UI',
      button: 'View on GitHub',
    },
    {
      id: 6,
      category: 'marketing',
      image: 'assets/images/marketing.gif',
      title: 'Digital Marketing',
      details: ['Improved online presence with Google Analytics, SEO, and Google Ads.', 'Researched keywords and audited pages for stronger search performance.', 'Tracked campaign behavior and optimized toward better ROI.'],
      link: 'https://docs.google.com/document/d/1uYv0ruzVb0YY0XzTCK4ax1l2G-x90ENx/edit?usp=sharing&ouid=117247420458496169293&rtpof=true&sd=true',
      tag: 'Marketing',
      button: 'View Details',
    },
  ];

  get filteredProjects(): Project[] {
    return this.filter === 'all' ? this.projects : this.projects.filter((project) => project.category === this.filter);
  }
}
