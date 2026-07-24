import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface BlogPost {
  title: string;
  image: string;
  category: string;
  date: string;
  description: string;
  link: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section__container blog__container" id="blog">
      <h2 class="section__header">My <span>Articles</span></h2>
      <p class="section__description">Thoughts on data science, development, and technology.</p>

      <div class="blog__slider-wrapper" *ngIf="blogPosts.length; else loadingPosts">
        <button class="blog-button-prev" type="button" aria-label="Previous article" (click)="scrollBlog('prev')">
          <i class="ri-arrow-left-line"></i>
        </button>
        <div class="blog-carousel">
          <div class="blog-track">
            <article 
              class="blog__slide" 
              *ngFor="let post of blogPosts; let i = index" 
              [ngStyle]="getSlideStyle(i)"
              [class.active-slide]="i === activeIndex">
              <div class="blog__image-right">
                <div class="blog__image-wrapper">
                  <img [src]="post.image" [alt]="post.title" />
                  <div class="blog__image-overlay"></div>
                </div>
              </div>
              <div class="blog__content-left">
                <div class="blog__meta">
                  <span class="blog__category">{{ post.category }}</span>
                  <span class="blog__date">{{ post.date }}</span>
                </div>
                <h3 class="blog__title">{{ post.title }}</h3>
                <p class="blog__description">{{ post.description }}</p>
                <a [href]="post.link" target="_blank" rel="noopener noreferrer" class="btn blog__btn">
                  Read Article <i class="ri-arrow-right-line"></i>
                </a>
              </div>
            </article>
          </div>
        </div>
        <button class="blog-button-next" type="button" aria-label="Next article" (click)="scrollBlog('next')">
          <i class="ri-arrow-right-line"></i>
        </button>
      </div>
      <ng-template #loadingPosts>
        <div class="blog-loading"><i class="ri-loader-4-line"></i>Loading latest articles...</div>
      </ng-template>
    </section>
  `,
})
export class BlogComponent implements OnInit {
  blogPosts: BlogPost[] = [];
  activeIndex = 0;

  private readonly fallbackPosts: BlogPost[] = [
    {
      title: 'Harnessing the Power of Spring Boot and Microservices',
      image: 'assets/images/java.gif',
      category: 'Backend Dev',
      date: 'June 20, 2026',
      description: 'An in-depth look at designing modular, scalable APIs using Spring Boot, Hibernate ORM, and Docker containerization.',
      link: 'https://satishportfolio.blogspot.com/'
    },
    {
      title: 'Predictive Analytics: Machine Learning on Bitcoin Close Prices',
      image: 'assets/images/bitcoin.gif',
      category: 'Data Science',
      date: 'May 12, 2026',
      description: 'Using Python, Pandas, and Scikit-Learn to perform linear regression analysis and price prediction on historical cryptocurrency data.',
      link: 'https://satishportfolio.blogspot.com/'
    },
    {
      title: 'Dynamic Web UI: Creating Immersive Interactive Portfolios',
      image: 'assets/images/portfoliogif.gif',
      category: 'Frontend Dev',
      date: 'April 05, 2026',
      description: 'Designing premium user experiences with glassmorphism card templates, custom viewport transitions, and smooth video scrubbing.',
      link: 'https://satishportfolio.blogspot.com/'
    }
  ];

  ngOnInit(): void {
    void this.loadBlogPosts();
  }

  scrollBlog(direction: 'prev' | 'next'): void {
    if (!this.blogPosts.length) return;
    if (direction === 'prev') {
      this.activeIndex = (this.activeIndex - 1 + this.blogPosts.length) % this.blogPosts.length;
    } else {
      this.activeIndex = (this.activeIndex + 1) % this.blogPosts.length;
    }
  }

  getSlideStyle(index: number): Record<string, string> {
    const numPosts = this.blogPosts.length;
    if (numPosts === 0) return {};

    // Calculate circular distance between index and activeIndex
    let diff = index - this.activeIndex;
    if (diff > numPosts / 2) {
      diff -= numPosts;
    } else if (diff < -numPosts / 2) {
      diff += numPosts;
    }

    const absDiff = Math.abs(diff);
    
    // Spacing configuration: tighter on mobile/watch screens to keep elements in view
    const w = window.innerWidth;
    const spacingPercent = w < 480 ? 42 : 58; // 42% on watch/mobile, 58% on desktop
    
    // Parabolic arch and fanning rotation formulas
    const rotate = diff * 12; // 12 degrees angle fanning (like flower petals)
    const translateX = diff * spacingPercent; // horizontal shift in % of slide size
    const translateY = absDiff * absDiff * 20; // quadratic displacement downward (arch curve)
    const scale = 1 - absDiff * 0.1; // active slide is full size
    const zIndex = 100 - absDiff; // active slide is stacked on top
    const opacity = absDiff > 2 ? '0' : `${1 - absDiff * 0.35}`; // fade out distant side elements

    return {
      'transform': `translate3d(calc(-50% + ${translateX}%), ${translateY}px, 0) rotate(${rotate}deg) scale(${scale})`,
      'z-index': `${zIndex}`,
      'opacity': opacity,
      'pointer-events': absDiff === 0 ? 'auto' : 'none',
      'transition': 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
      'position': 'absolute',
      'left': '50%',
      'top': '0',
      'width': '100%',
      'max-width': '520px'
    };
  }

  private async loadBlogPosts(): Promise<void> {
    try {
      const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://satishportfolio.blogspot.com/feeds/posts/default');
      const data = (await response.json()) as { items?: Array<Record<string, unknown>> };
      const items = data.items ?? [];
      if (items.length > 0) {
        this.blogPosts = items.slice(0, 6).map((item) => this.formatPost(item));
      } else {
        this.blogPosts = [...this.fallbackPosts];
      }
    } catch {
      this.blogPosts = [...this.fallbackPosts];
    }
  }

  private formatPost(item: Record<string, unknown>): BlogPost {
    const content = String(item['content'] ?? item['description'] ?? '');
    const doc = new DOMParser().parseFromString(content, 'text/html');
    const image = doc.querySelector('img')?.getAttribute('src') || String(item['thumbnail'] ?? 'assets/images/portfoliogif.gif');
    const text = doc.body.textContent?.trim().replace(/\s+/g, ' ') || 'Read the full article on the blog.';
    const pubDate = String(item['pubDate'] ?? '');
    const date = pubDate ? new Date(pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Blog';
    const categories = item['categories'] as string[] | undefined;

    return {
      title: String(item['title'] ?? 'Portfolio article'),
      image,
      category: categories?.[0] ?? 'Blog',
      date,
      description: `${text.slice(0, 140)}...`,
      link: String(item['link'] ?? 'https://satishportfolio.blogspot.com/'),
    };
  }
}
