import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioSynthService } from '../../shared/audio-synth.service';

interface Certificate {
  title: string;
  image: string;
  description: string;
  link: string;
  source: string;
}

interface Milestone {
  year: string;
  title: string;
  subtitle: string;
  details: string;
}

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- MAIN WRAPPER FOR BOTH ROOMS (Room 5 and Room 6 timeline) -->
    <div class="flex flex-row h-full select-none bg-transparent">
      
      <!-- ROOM 5: CERTIFICATIONS OBSERVATION -->
      <section class="relative w-[100vw] h-full flex flex-col justify-center items-center px-6 md:px-16 overflow-hidden bg-transparent" id="certifications">
        <!-- Section Label HUD -->
        <div class="absolute top-12 left-12 flex items-center gap-3">
          <span class="w-2.5 h-2.5 bg-[#00f0ff] rounded-full animate-ping"></span>
          <span class="font-mono text-xs text-[#00f0ff] tracking-[0.3em] uppercase">O-05 // CREDENTIALS OBSERVATORY</span>
        </div>

        <div class="max-w-6xl w-full flex flex-col z-10">
          <div class="mb-10 text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-[rgba(0,240,255,0.06)] border border-[rgba(0,240,255,0.15)] rounded-full text-[10px] font-mono tracking-widest text-[#00f0ff] uppercase w-fit mb-3">
              Verified Keys
            </div>
            <h2 class="text-3xl md:text-4xl font-black uppercase tracking-wider text-white">
              CERTIFICATIONS &amp; <span class="bg-gradient-to-r from-[#00f0ff] to-[#9000ff] bg-clip-text text-transparent">COURSES</span>
            </h2>
            <p class="font-mono text-[10px] md:text-xs text-[#7a8099] tracking-widest mt-1">
              CLICK TO ACCESS ORIGINAL ENCRYPTED CERTIFICATE
            </p>
          </div>

          <!-- Horizontal scrolling transparent panel grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-visible">
            <div *ngFor="let cert of certificates; let i = index"
                 (click)="openCert(cert.link)"
                 (mouseenter)="playHover()"
                 class="group relative bg-[rgba(10,15,30,0.4)] hover:bg-[rgba(0,240,255,0.04)] border border-[rgba(0,240,255,0.15)] hover:border-[#00f0ff] rounded-lg p-4 backdrop-blur-md transition-all duration-300 cursor-pointer shadow-xl hover:-translate-y-2 flex flex-col justify-between">
              
              <!-- Subtle card sheen reflection effect -->
              <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-[rgba(255,255,255,0.02)] to-transparent pointer-events-none rounded-lg"></div>

              <div>
                <!-- Source Badge -->
                <div class="flex justify-between items-center mb-4">
                  <span class="text-[9px] font-mono text-[#7a8099] uppercase tracking-widest">{{ cert.source }}</span>
                  <span class="w-1.5 h-1.5 bg-[#00f0ff] rounded-full group-hover:animate-ping"></span>
                </div>
                
                <!-- Graphic Canvas Frame placeholder -->
                <div class="w-full h-24 bg-[rgba(2,4,12,0.6)] border border-[rgba(0,240,255,0.1)] rounded flex items-center justify-center overflow-hidden mb-3">
                  <img [src]="cert.image" [alt]="cert.title" class="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <h3 class="text-xs font-bold text-white uppercase tracking-wider line-clamp-2 mb-2 group-hover:text-[#00f0ff] transition-colors duration-200">{{ cert.title }}</h3>
                <p class="text-[10px] font-mono text-[#7a8099] leading-relaxed line-clamp-3 mb-4">{{ cert.description }}</p>
              </div>

              <div class="text-[9px] font-mono text-[#00f0ff] uppercase tracking-widest flex items-center gap-1 mt-2">
                VERIFY KEYS <i class="ri-arrow-right-up-line"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ROOM 6A: SYSTEM TIMELINE PATHWAY -->
      <section class="relative w-[100vw] h-full flex flex-col justify-center items-center px-6 md:px-16 overflow-hidden bg-transparent" id="timeline">
        <!-- Section Label HUD -->
        <div class="absolute top-12 left-12 flex items-center gap-3">
          <span class="w-2.5 h-2.5 bg-[#00f0ff] rounded-full animate-ping"></span>
          <span class="font-mono text-xs text-[#00f0ff] tracking-[0.3em] uppercase">O-06 // LOG TIMELINE</span>
        </div>

        <div class="max-w-4xl w-full flex flex-col z-10 relative">
          <div class="mb-12 text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-[rgba(0,240,255,0.06)] border border-[rgba(0,240,255,0.15)] rounded-full text-[10px] font-mono tracking-widest text-[#00f0ff] uppercase w-fit mb-3">
              Historical Logs
            </div>
            <h2 class="text-3xl md:text-4xl font-black uppercase tracking-wider text-white">
              TIMELINE <span class="bg-gradient-to-r from-[#00f0ff] to-[#9000ff] bg-clip-text text-transparent">PATHWAY</span>
            </h2>
          </div>

          <!-- Vertical Glowing Synapse Line -->
          <div class="relative pl-8 border-l border-[rgba(0,240,255,0.2)] ml-4 md:ml-12 space-y-8 py-2">
            <!-- Glowing active particle on path -->
            <div class="absolute top-0 left-[-2px] w-[3px] h-[50%] bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]"></div>

            <div *ngFor="let step of timeline; let idx = index"
                 (mouseenter)="playHover()"
                 class="relative group">
              <!-- Connector Node -->
              <div class="absolute left-[-38px] top-1.5 w-4 h-4 rounded-full bg-[#02040c] border-2 border-[rgba(0,240,255,0.35)] group-hover:border-[#00f0ff] group-hover:shadow-[0_0_10px_#00f0ff] flex items-center justify-center transition-all duration-300">
                <div class="w-1.5 h-1.5 rounded-full bg-[rgba(0,240,255,0.4)] group-hover:bg-[#00f0ff]"></div>
              </div>

              <!-- Content Glass Box -->
              <div class="bg-[rgba(10,15,30,0.4)] hover:bg-[rgba(0,240,255,0.03)] border border-[rgba(0,240,255,0.15)] hover:border-[#00f0ff] rounded-lg p-4 backdrop-blur-md transition-all duration-300 max-w-xl">
                <div class="flex justify-between items-baseline mb-2">
                  <h3 class="text-xs md:text-sm font-bold uppercase tracking-wider text-white">{{ step.title }}</h3>
                  <span class="text-[9px] font-mono text-[#00f0ff] uppercase tracking-widest ml-4 shrink-0">{{ step.year }}</span>
                </div>
                <h4 class="text-[10px] font-mono text-[#7a8099] uppercase tracking-widest mb-2">{{ step.subtitle }}</h4>
                <p class="text-[11px] font-mono text-[#7a8099] leading-relaxed">{{ step.details }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class ResumeComponent {
  private audioService = inject(AudioSynthService);

  readonly certificates: Certificate[] = [
    {
      title: 'Cloud Computing',
      image: 'assets/images/12210470_MOOC_DZU2MXFCertificate_page-0001.jpg',
      description: 'Cloud computing structures, network architectures, and server virtualization credentials from NPTEL/Swayam.',
      link: 'https://drive.google.com/file/d/1kXMl26U8M9dGRxv2W_9ZGZ5N3DfTL2JC/view?usp=sharing',
      source: 'NPTEL'
    },
    {
      title: 'Machine Learning',
      image: 'assets/images/12210470_MOOC_7VK5AUXCertificate_page-0001.jpg',
      description: 'Supervised Machine Learning algorithms, cost functions, gradient descent, and training validation via Coursera.',
      link: 'https://drive.google.com/file/d/10To75UJpChRRsKQdrSanRagJ7EbPhhMp/view?usp=sharing',
      source: 'Coursera'
    },
    {
      title: 'Python Core',
      image: 'assets/images/python_basic certificate_page-0001.jpg',
      description: 'Python algorithms, scripting logic, data parsing structures, and core coding evaluations via HackerRank.',
      link: 'https://www.hackerrank.com/certificates/b18906a3a19c',
      source: 'HackerRank'
    },
    {
      title: 'Tableau Analytics',
      image: 'assets/images/12210470_MOOC_PVXX77WCertificate_page-0001.jpg',
      description: 'Interactive dashboard architectures, data connections, calculated fields, and visual metrics mapping on Tableau.',
      link: 'https://drive.google.com/file/d/1wL3HxfTMfYB-OstuJikaRAdDZVYf3-s3/view?usp=sharing',
      source: 'Coursera'
    },
    {
      title: 'C++ Programming',
      image: 'assets/images/COURSERA_CPP_page-0001.jpg',
      description: 'Object-oriented patterns, pointers, memory models, compiler workflows, and core algorithms logic on Coursera.',
      link: 'https://drive.google.com/file/d/1jjIG6ASvM0bo2-P_SIURsjUvIwdd348o/view?usp=sharing',
      source: 'Coursera'
    }
  ];

  readonly timeline: Milestone[] = [
    {
      year: '2022 - PRESENT',
      title: 'B.Tech Computer Science',
      subtitle: 'Lovely Professional University',
      details: 'Deep training in core structures: Algorithms, Relational Systems, Operating Architectures, and Full Stack application configurations. Maintained 8.12 CGPA.'
    },
    {
      year: '2024 (SUMMER)',
      title: 'Summer Training Program',
      subtitle: 'Board Infinity SQL & DBMS',
      details: 'Intensive database mechanics training. Focused on ER diagrams, indexing algorithms (B/B+ Trees), concurrency systems, joins, triggers, and relational constraints.'
    },
    {
      year: '2024 - 2025',
      title: 'Systems & ML Specializations',
      subtitle: 'Independent Research & Certs',
      details: 'Built predictive estimators for financial assets and Tableau metrics. Certified in supervised networks and cloud scaling technologies.'
    },
    {
      year: 'CURRENT',
      title: 'Analytics Lab Node',
      subtitle: 'Interactive Experiences',
      details: 'Integrating machine learning datasets and REST backends with advanced reactive frameworks. Launching holographic WebGL browser consoles.'
    }
  ];

  openCert(link: string): void {
    this.audioService.playSelectClick();
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  playHover(): void {
    this.audioService.playHoverTick();
  }
}
