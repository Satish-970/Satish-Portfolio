import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section__container service__container" id="service">
      <div class="section__tag">Technologies</div>
      <h2 class="section__header">Skills & <span>Tech Stack</span></h2>
      <p class="section__description">Full-stack development, data engineering, cloud tooling, and digital analytics.</p>

      <div class="skill-group" *ngFor="let group of skillGroups">
        <h3 class="skill-group__title"><span></span>{{ group.label }}</h3>
        <div class="service__grid">
          <article class="service__card" *ngFor="let skill of group.skills">
            <span><img [src]="skill[0]" [alt]="skill[1]" loading="lazy" /></span>
            <h4>{{ skill[1] }}</h4>
          </article>
        </div>
      </div>
    </section>
  `,
})
export class SkillsComponent {
  readonly skillGroups = [
    { label: 'Languages', skills: [['assets/images/skills/python.svg', 'Python'], ['assets/images/skills/java.svg', 'Java'], ['assets/images/skills/cplusplus.svg', 'C / C++'], ['assets/images/skills/r.png', 'R'], ['assets/images/skills/javascript.svg', 'JavaScript'], ['assets/images/skills/typescript.svg', 'TypeScript']] },
    { label: 'Web & Frameworks', skills: [['assets/images/skills/html5.svg', 'HTML5'], ['assets/images/skills/css3.svg', 'CSS3'], ['assets/images/skills/react.svg', 'React.js'], ['assets/images/skills/angular.svg', 'Angular'], ['assets/images/skills/nodejs.svg', 'Node.js'], ['assets/images/skills/spring.svg', 'Spring']] },
    { label: 'Data & Databases', skills: [['assets/images/skills/mysql.svg', 'SQL / MySQL'], ['assets/images/skills/postgresql.svg', 'PostgreSQL'], ['assets/images/skills/mongodb.svg', 'MongoDB'], ['assets/images/skills/hadoop.svg', 'Hadoop / Hive'], ['assets/images/skills/spark.svg', 'Apache Spark'], ['assets/images/skills/tableau.png', 'Tableau']] },
    { label: 'Tools & DevOps', skills: [['assets/images/skills/git.svg', 'Git / GitHub'], ['assets/images/skills/docker.svg', 'Docker'], ['assets/images/skills/kubernetes.svg', 'Kubernetes'], ['assets/images/skills/jupyter.svg', 'Jupyter'], ['assets/images/skills/postman.svg', 'Postman'], ['assets/images/skills/jira.png', 'Jira / Agile']] },
    { label: 'Analytics & Marketing', skills: [['assets/images/skills/google-ads.png', 'SEO & Google Ads'], ['assets/images/skills/google-analytics.svg', 'Google Analytics']] },
  ];
}
