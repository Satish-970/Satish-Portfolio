import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <section class="section__container about__container" id="about">
      <div class="about__image">
        <div class="about__image-frame">
          <img src="assets/images/aboutme.jpeg" alt="Satish Pakalapati" />
        </div>
      </div>

      <div class="about__content">
        <div class="section__tag">About Me</div>
        <h2 class="section__header">Passionate About <span>Data & Innovation</span></h2>
        <p>
          I'm Satish Pakalapati, a B.Tech Computer Science student at Lovely Professional University,
          building a strong path across Data Science, Digital Marketing, and full-stack development.
        </p>
        <h4>
          I enjoy crafting dynamic dashboards, machine learning models, SQL analysis, and polished web experiences that turn
          rough ideas into useful outcomes.
        </h4>
        <div class="about-chips">
          <span><i class="ri-graduation-cap-line"></i>LPU B.Tech CSE</span>
          <span><i class="ri-bar-chart-2-line"></i>Data Analyst</span>
          <span><i class="ri-code-s-slash-line"></i>Full Stack Dev</span>
        </div>
        <div class="about__btns">
          <a href="/Resume.pdf" target="_blank" class="download__btn" rel="noopener noreferrer"><i class="ri-download-2-line"></i>Access My CV</a>
          <a href="mailto:satishpakalapati65@gmail.com" title="Email"><i class="ri-mail-fill"></i></a>
          <a href="https://github.com/Satish-970" target="_blank" rel="noopener noreferrer" title="GitHub"><i class="ri-github-fill"></i></a>
          <a href="https://www.linkedin.com/in/satishpakalapati/" target="_blank" rel="noopener noreferrer" title="LinkedIn"><i class="ri-linkedin-fill"></i></a>
        </div>
      </div>
    </section>
  `,
})
export class AboutComponent {}
