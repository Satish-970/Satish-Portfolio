import { Component, OnInit, OnDestroy, signal, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AboutModule {
  id: number;
  title: string;
  subtitle: string;
  details: string[];
  icon: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative w-[100vw] h-full flex flex-col justify-center items-center px-8 md:px-16 overflow-hidden bg-transparent select-none" id="about">
      <!-- Section Label HUD -->
      <div class="absolute top-12 left-12 flex items-center gap-3">
        <span class="w-2.5 h-2.5 bg-[#00f0ff] rounded-full animate-ping"></span>
        <span class="font-mono text-xs text-[#00f0ff] tracking-[0.3em] uppercase">O-02 // DOME METRICS</span>
      </div>

      <div class="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        <!-- Title Panel -->
        <div class="flex flex-col text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-[rgba(0,240,255,0.06)] border border-[rgba(0,240,255,0.15)] rounded-full text-[10px] font-mono tracking-widest text-[#00f0ff] uppercase w-fit mb-4">
            Identity Node
          </div>
          <h2 class="text-4xl md:text-5xl font-black font-sans uppercase tracking-wider text-white leading-tight">
            PASSIONATE ABOUT <br/>
            <span class="bg-gradient-to-r from-[#00f0ff] to-[#9000ff] bg-clip-text text-transparent">DATA &amp; INNOVATION</span>
          </h2>
          <p class="mt-6 text-sm md:text-base text-[#7a8099] leading-relaxed max-w-lg font-mono">
            I am Satish Pakalapati, a Computer Science engineer at Lovely Professional University. I bridge full-stack development, data science pipelines, and digital campaigns.
          </p>
          <div class="mt-8 flex gap-4">
            <a href="/Resume.pdf" target="_blank" rel="noopener noreferrer" 
               class="px-5 py-2.5 bg-[rgba(0,240,255,0.1)] border border-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#02040c] text-white font-mono text-xs uppercase tracking-wider rounded transition-all duration-300">
              Access Full CV
            </a>
          </div>
        </div>

        <!-- 3D Orbit Ring Container -->
        <div class="relative w-full h-[400px] flex items-center justify-center perspective-[1200px] overflow-visible">
          <!-- Central Hologram Glow -->
          <div class="absolute w-24 h-24 rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.25)_0%,rgba(0,0,0,0)_70%)] animate-pulse flex items-center justify-center">
            <div class="w-10 h-10 border border-[#00f0ff] rounded-full animate-[spin_8s_linear_infinite] flex items-center justify-center">
              <i class="ri-user-3-line text-[#00f0ff] text-lg"></i>
            </div>
          </div>

          <!-- Orbiting Cards Wrap -->
          <div class="relative w-full h-full preserve-3d flex items-center justify-center" 
               [style.transform]="'rotateY(' + angle + 'deg)'">
            
            <div *ngFor="let card of modules; let i = index" 
                 class="absolute w-[260px] md:w-[280px] bg-[rgba(10,15,30,0.45)] border border-[rgba(0,240,255,0.2)] hover:border-[#00f0ff] p-5 rounded-xl backdrop-blur-xl transition-all duration-500 shadow-[0_0_20px_rgba(0,240,255,0.05)] hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col justify-between"
                 [style.transform]="'rotateY(' + (i * 90) + 'deg) translateZ(' + radius + 'px) rotateY(' + (-angle - (i * 90)) + 'deg)'"
                 (mouseenter)="onHover()"
                 (mouseleave)="onLeave()">
              
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="font-mono text-[9px] text-[#7a8099]">#0{{ card.id }} // MODULE</span>
                  <div class="w-8 h-8 rounded bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.2)] flex items-center justify-center text-[#00f0ff]">
                    <i [class]="card.icon"></i>
                  </div>
                </div>
                <h3 class="text-sm font-mono uppercase tracking-wider text-white mb-1">{{ card.title }}</h3>
                <h4 class="text-[10px] font-mono text-[#00f0ff] mb-3 uppercase tracking-widest">{{ card.subtitle }}</h4>
                <ul class="text-[11px] font-mono text-[#7a8099] space-y-2 list-none">
                  <li *ngFor="let item of card.details" class="flex gap-2 items-start">
                    <span class="text-[#00f0ff] mt-0.5">•</span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .perspective-\\[1200px\\] {
      perspective: 1200px;
    }
    .preserve-3d {
      transform-style: preserve-3d;
    }
  `]
})
export class AboutComponent implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  angle = 0;
  radius = 280; // Distance of cards from center
  private frameId?: number;
  private isHovered = false;

  readonly modules: AboutModule[] = [
    {
      id: 1,
      title: 'Education',
      subtitle: 'Academic Milestones',
      details: [
        'B.Tech CSE at Lovely Professional University (8.12 CGPA)',
        'Intermediate at DKNP JR College (95.7%)',
        'Secondary at Sri Siddartha (10.0 CGPA)'
      ],
      icon: 'ri-graduation-cap-line'
    },
    {
      id: 2,
      title: 'Experience',
      subtitle: 'Summer Training Program',
      details: [
        'Board Infinity: DBMS & SQL systems analysis',
        'Built relational schemas & query optimizations',
        'Designed database integrity & normalization scripts'
      ],
      icon: 'ri-database-2-line'
    },
    {
      id: 3,
      title: 'Interests',
      subtitle: 'Core Focus Areas',
      details: [
        'Predictive machine learning models & pipelines',
        'Exploratory data analysis & statistical trends',
        'High-performance interactive web experiences'
      ],
      icon: 'ri-compass-3-line'
    },
    {
      id: 4,
      title: 'Current Focus',
      subtitle: 'Exploratory Frontiers',
      details: [
        'Angular 21 signals & reactive programming',
        'Tableau interactive business reports',
        'Cloud-native services & containerized deployments'
      ],
      icon: 'ri-focus-3-line'
    }
  ];

  ngOnInit(): void {
    this.animateOrbit();
  }

  ngOnDestroy(): void {
    if (this.frameId) cancelAnimationFrame(this.frameId);
  }

  private animateOrbit = (): void => {
    this.frameId = requestAnimationFrame(this.animateOrbit);
    // Slowly rotate orbit angle (revolving speed). Slows down when user hovers cards.
    const speed = this.isHovered ? 0.04 : 0.15;
    this.angle = (this.angle + speed) % 360;
    this.cdr.detectChanges();
  };

  onHover(): void {
    this.isHovered = true;
  }

  onLeave(): void {
    this.isHovered = false;
  }
}
