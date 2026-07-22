import { Component, OnInit, OnDestroy, signal, ElementRef, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioSynthService } from '../../shared/audio-synth.service';
import gsap from 'gsap';

interface Project {
  id: number;
  category: string;
  image: string;
  title: string;
  details: string[];
  link: string;
  tag: string;
  button: string;
  stats: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative w-[100vw] h-full flex flex-col justify-center items-center px-4 md:px-12 overflow-hidden bg-transparent select-none" id="project">
      <!-- Section Label HUD -->
      <div class="absolute top-12 left-12 flex items-center gap-3">
        <span class="w-2.5 h-2.5 bg-[#00f0ff] rounded-full animate-ping"></span>
        <span class="font-mono text-xs text-[#00f0ff] tracking-[0.3em] uppercase">O-03 // PROJECTS OBSERVATORY</span>
      </div>

      <!-- Header -->
      <div class="absolute top-24 md:top-28 text-center max-w-xl z-20">
        <h2 class="text-3xl md:text-4xl font-black uppercase tracking-wider text-white">
          PROJECTS <span class="bg-gradient-to-r from-[#00f0ff] to-[#9000ff] bg-clip-text text-transparent">OBSERVATORY</span>
        </h2>
        <p class="font-mono text-[10px] md:text-xs text-[#7a8099] tracking-widest mt-2">
          DRAG TO ROTATE // HOVER TO INSPECT SYSTEM METRICS // CLICK TO OPEN
        </p>
      </div>

      <!-- 3D Cylinder Carousel Wrapper -->
      <div class="relative w-full max-w-5xl h-[420px] md:h-[480px] flex items-center justify-center perspective-[1600px] overflow-visible z-10"
           (mousedown)="onDragStart($event)"
           (touchstart)="onDragStart($event)"
           #observatoryWrapper>
        
        <!-- Rotating Container -->
        <div class="relative w-full h-full preserve-3d flex items-center justify-center"
             [style.transform]="'rotateY(' + rotationAngle + 'deg)'">
          
          <div *ngFor="let proj of projects; let i = index"
               class="absolute w-[280px] md:w-[320px] bg-[rgba(10,15,30,0.5)] border border-[rgba(0,240,255,0.2)] rounded-xl overflow-hidden backdrop-blur-xl transition-all duration-300 flex flex-col cursor-grab select-none hover:shadow-[0_0_40px_rgba(0,240,255,0.25)] hover:border-[#00f0ff]"
               [class.scale-105]="hoveredIndex === i"
               [class.z-30]="hoveredIndex === i"
               [style.transform]="'rotateY(' + (i * 60) + 'deg) translateZ(' + radius + 'px) rotateY(' + (-rotationAngle - (i * 60)) + 'deg)'"
               (mouseenter)="onCardHover(i)"
               (mouseleave)="onCardLeave()">
            
            <!-- Thumbnail GIF/Image -->
            <div class="relative w-full h-36 md:h-40 overflow-hidden border-b border-[rgba(0,240,255,0.15)]">
              <img [src]="proj.image" [alt]="proj.title" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
              <div class="absolute top-3 right-3 px-2 py-0.5 bg-[rgba(2,4,12,0.85)] border border-[rgba(0,240,255,0.3)] rounded text-[9px] font-mono tracking-widest text-[#00f0ff] uppercase">
                {{ proj.tag }}
              </div>
            </div>

            <!-- Details Body -->
            <div class="p-4 flex flex-col justify-between flex-1">
              <div>
                <div class="flex justify-between items-baseline mb-2">
                  <h3 class="text-sm font-bold uppercase tracking-wider text-white font-sans truncate pr-2">{{ proj.title }}</h3>
                  <span class="text-[9px] font-mono text-[#00f0ff] uppercase tracking-widest shrink-0">{{ proj.stats }}</span>
                </div>
                <ul class="text-[10px] font-mono text-[#7a8099] leading-relaxed space-y-1 mb-4">
                  <li *ngFor="let detail of proj.details" class="truncate">
                    • {{ detail }}
                  </li>
                </ul>
              </div>

              <!-- Links -->
              <div class="flex gap-2">
                <a [href]="proj.link" target="_blank" rel="noopener noreferrer" 
                   (click)="$event.stopPropagation(); playSelect()"
                   class="flex-1 text-center py-2 bg-[rgba(0,240,255,0.1)] hover:bg-[#00f0ff] hover:text-[#02040c] border border-[#00f0ff] rounded text-[9px] font-mono uppercase tracking-widest transition-all duration-300">
                  {{ proj.button }}
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Holographic Status Bar (Bloomberg feeling) -->
      <div class="absolute bottom-12 flex justify-between items-center w-full max-w-4xl px-8 font-mono text-[9px] text-[#7a8099] border-t border-[rgba(0,240,255,0.1)] pt-4 z-20">
        <div>ORBITAL_SECTOR: P-03</div>
        <div class="hidden sm:block">STATUS: DRAG FOR MANUAL OVERRIDE</div>
        <div>ORBIT_SPEED: {{ isDragging || hoveredIndex !== null ? '0.04°/F' : '0.12°/F' }}</div>
      </div>
    </section>
  `,
  styles: [`
    .perspective-\\[1600px\\] {
      perspective: 1600px;
    }
    .preserve-3d {
      transform-style: preserve-3d;
    }
  `]
})
export class ProjectsComponent implements OnInit, OnDestroy {
  @ViewChild('observatoryWrapper') observatoryWrapper!: ElementRef<HTMLDivElement>;

  private audioService = inject(AudioSynthService);
  private cdr = inject(ChangeDetectorRef);

  rotationAngle = 0;
  radius = 380; // Distance of card planes from cylinder axis
  hoveredIndex: number | null = null;

  // Drag state properties
  isDragging = false;
  private startX = 0;
  private startAngle = 0;
  private autoRotateFrameId?: number;

  readonly projects: Project[] = [
    {
      id: 1,
      category: 'data',
      image: 'assets/images/bitcoin.gif',
      title: 'Bitcoin Close Price Predictor',
      details: [
        'Analyzes and predicts Bitcoin prices using ML models.',
        'Preprocessing, exploratory analysis, and feature math.',
        'Uses Linear Regression to derive trade insights.'
      ],
      link: 'https://github.com/Satish-970/Bitcoin-price',
      tag: 'ML / Python',
      button: 'View GitHub',
      stats: 'ACC: 91.4%'
    },
    {
      id: 2,
      category: 'viz',
      image: 'assets/images/dashboard.gif',
      title: 'Salary Data Analysis',
      details: [
        'Explores job markets using interactive Tableau reports.',
        'Visualizes metrics by roles, seniority, and locations.',
        'Uncovers global patterns and income distribution data.'
      ],
      link: 'https://github.com/Satish-970/DataSciencejobsAnalysis',
      tag: 'Tableau',
      button: 'View Tableau',
      stats: 'RECORDS: 10K+'
    },
    {
      id: 3,
      category: 'data',
      image: 'assets/images/sql.gif',
      title: 'SQL HR System Analysis',
      details: [
        'Performs database analysis for human resources patterns.',
        'Joins, complex aggregations, window utilities, CTEs.',
        'Identifies organizational gaps and employee trends.'
      ],
      link: 'https://github.com/Satish-970/SQL',
      tag: 'SQL / HR',
      button: 'View SQL',
      stats: 'TABLES: 12'
    },
    {
      id: 4,
      category: 'web',
      image: 'assets/images/java.gif',
      title: 'DevHub Java Full Stack',
      details: [
        'Spring Boot backend with JPA and MySQL architecture.',
        'Security layer: JWT credentials validation.',
        'React SPA client featuring Redux state engine.'
      ],
      link: 'https://github.com/Satish-970/DevHub-JavaFullStack',
      tag: 'Java / React',
      button: 'View Core',
      stats: 'APIs: REST'
    },
    {
      id: 5,
      category: 'web',
      image: 'assets/images/portfoliogif.gif',
      title: 'Analytics Lab Portfolio',
      details: [
        'Polished design featuring responsive glass overlays.',
        'Spline camera curves inside background Three.js.',
        'Dynamic synthesizer drone using Web Audio API.'
      ],
      link: 'https://github.com/Satish-970/portfolio',
      tag: 'Angular 21',
      button: 'View UI',
      stats: 'FPS: 60'
    },
    {
      id: 6,
      category: 'marketing',
      image: 'assets/images/marketing.gif',
      title: 'Digital Marketing Audit',
      details: [
        'SEO review, search optimization, campaign planning.',
        'Utilized Google Analytics 4 tracking metrics.',
        'Evaluated click-through behavior and ad ROI.'
      ],
      link: 'https://docs.google.com/document/d/1uYv0ruzVb0YY0XzTCK4ax1l2G-x90ENx/edit?usp=sharing&ouid=117247420458496169293&rtpof=true&sd=true',
      tag: 'GA4 / Ads',
      button: 'View Document',
      stats: 'GA4 ENABLED'
    }
  ];

  ngOnInit(): void {
    this.adjustRadius();
    this.startAutoRotation();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.onResize.bind(this), { passive: true });
      window.addEventListener('mousemove', this.onDragMove.bind(this), { passive: true });
      window.addEventListener('mouseup', this.onDragEnd.bind(this), { passive: true });
      window.addEventListener('touchmove', this.onDragMove.bind(this), { passive: true });
      window.addEventListener('touchend', this.onDragEnd.bind(this), { passive: true });
    }
  }

  ngOnDestroy(): void {
    if (this.autoRotateFrameId) cancelAnimationFrame(this.autoRotateFrameId);
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize);
      window.removeEventListener('mousemove', this.onDragMove);
      window.removeEventListener('mouseup', this.onDragEnd);
      window.removeEventListener('touchmove', this.onDragMove);
      window.removeEventListener('touchend', this.onDragEnd);
    }
  }

  private onResize(): void {
    this.adjustRadius();
  }

  private adjustRadius(): void {
    // Make radius responsive to fit screen widths
    const w = typeof window !== 'undefined' ? window.innerWidth : 1000;
    if (w < 640) {
      this.radius = 260; // Narrow screens
    } else if (w < 768) {
      this.radius = 320;
    } else {
      this.radius = 380; // Desktop default
    }
  }

  private startAutoRotation = (): void => {
    this.autoRotateFrameId = requestAnimationFrame(this.startAutoRotation);
    
    // Slow down rotation when hovering or dragging
    if (!this.isDragging) {
      const speed = this.hoveredIndex !== null ? 0.04 : 0.12;
      this.rotationAngle = (this.rotationAngle + speed) % 360;
    }
  };

  onCardHover(index: number): void {
    this.hoveredIndex = index;
    this.audioService.playHoverTick();
  }

  onCardLeave(): void {
    this.hoveredIndex = null;
  }

  playSelect(): void {
    this.audioService.playSelectClick();
  }

  // Mouse Drag / Touch Swipe gesture handling
  onDragStart(event: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    this.startX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    this.startAngle = this.rotationAngle;
    this.audioService.playSelectClick();
  }

  onDragMove = (event: MouseEvent | TouchEvent): void => {
    if (!this.isDragging) return;
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const deltaX = clientX - this.startX;
    
    // Convert drag movement pixels to Y rotation degrees
    const dragSensitivity = 0.28;
    this.rotationAngle = this.startAngle + deltaX * dragSensitivity;
  };

  onDragEnd = (): void => {
    this.isDragging = false;
  };
}
