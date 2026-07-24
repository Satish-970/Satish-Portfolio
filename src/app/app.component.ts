import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AboutComponent } from './components/about/about.component';
import { BannerComponent } from './components/banner/banner.component';
import { BlogComponent } from './components/blog/blog.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeroComponent } from './components/hero/hero.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ResumeComponent } from './components/resume/resume.component';
import { SkillsComponent } from './components/skills/skills.component';
import { sectionNav$ } from './shared/section-navigation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent, HeroComponent, BannerComponent, AboutComponent,
    ResumeComponent, ProjectsComponent, SkillsComponent, BlogComponent,
    ContactComponent, FooterComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cursor')   cursorEl!:  ElementRef<HTMLDivElement>;
  @ViewChild('preloader') preloaderEl!: ElementRef<HTMLDivElement>;
  @ViewChild('quoteEl')   quoteEl!:   ElementRef<HTMLParagraphElement>;
  @ViewChild('authorEl')  authorEl!:  ElementRef<HTMLSpanElement>;
  @ViewChild('barEl')     barEl!:     ElementRef<HTMLDivElement>;
  @ViewChild('litPath')   litPathRef?: ElementRef<SVGPathElement>;
  @ViewChild('scrollerVideo') scrollerVideoRef?: ElementRef<HTMLVideoElement>;

  private cx = 0; private cy = 0;
  private raf = 0;
  private navSub?: Subscription;

  // Zoom States
  zoomedSectionId: string | null = null;
  containerTransform = 'none';
  showImmersiveModal = false;
  audioMuted = true;
  audioInitialized = false;
  private audio?: HTMLAudioElement;

  // Background video state
  targetVideoTime = 0.2;
  private currentVideoTime = 0.2;
  private videoScrubFrameId?: number;

  // Morphing text brand states
  displayName = 'Satish Pakalapati';
  displayPortfolio = 'Portfolio';

  // SVG Snake map state
  hoveredNodeIdx: number | null = null;
  horizontalSpan = 400; // dynamic horizontal spacing
  snakePathTotalLength = 2200;
  snakePathLength = 2200;
  snakePathOffset = 2200; // fully hidden at start
  private firstLoadDone = false;
  isInitialDrawing = true; // slow draw state at start

  // Fractional positions of each node along the full path (0 = start, 1 = end)
  snakeNodeFractions = [0, 0.143, 0.286, 0.429, 0.571, 0.714, 0.857, 1.0];

  // Coordinates helper values
  get lx(): number { return 250 - this.horizontalSpan / 2; }
  get rx(): number { return 250 + this.horizontalSpan / 2; }
  get mx(): number { return 250; }

  // Dynamically build base SVG path string matching custom horizontal span
  get baseSvgPath(): string {
    const lx = this.lx;
    const rx = this.rx;
    const mx = this.mx;
    const lb = lx - 110;
    const rb = rx + 110;

    // Start directly at Node 01 (lx, 80) and run s-curve down shifted diagonal rows
    return `M ${lx},80 ` +
           `C ${lx + 120},60 ${rx - 120},100 ${rx},180 ` +
           `C ${rb},180 ${rb + 20},340 ${rx + 60},360 C ${rx - 30},380 ${rx - 30},460 ${rx + 60},480 C ${rb},500 ${rb - 20},540 ${rx},540 ` +
           `C ${rx - 120},540 ${lx + 120},580 ${lx},640 ` +
           `C ${lb},640 ${lb - 20},800 ${lx - 60},820 C ${lx + 30},840 ${lx + 30},920 ${lx - 60},940 C ${lb},960 ${lb - 120},1000 ${lx},1000 ` +
           `C ${lx + 120},1000 ${rx - 120},1040 ${rx},1100 ` +
           `C ${rb},1100 ${rb + 20},1260 ${rx + 60},1280 C ${rx - 30},1300 ${rx - 30},1380 ${rx + 60},1400 C ${rb},1420 ${rb - 20},1460 ${rx},1460 ` +
           `C ${rx - 140},1520 ${lx + 120},1480 ${lx},1560 ` +
           `C ${lx - 70},1620 ${lx + 100},1650 ${mx - 50},1630 ` +
           `C ${mx + 120},1610 ${mx + 80},1640 ${mx},1640`;
  }

  onNodeHover(idx: number): void {
    this.hoveredNodeIdx = idx;
    const fraction = this.snakeNodeFractions[idx];
    this.snakePathOffset = this.snakePathTotalLength * (1 - fraction);
  }

  onNodeLeave(): void {
    this.hoveredNodeIdx = null;
    // Retract back to Node 01 (Home) fraction instead of fully disappearing
    const defaultFraction = this.snakeNodeFractions[0];
    this.snakePathOffset = this.snakePathTotalLength * (1 - defaultFraction);
  }

  /** @deprecated kept to avoid template errors */
  getSnakeRow(i: number): number { return Math.floor(i / 2); }

  readonly slideList = [
    { id: 'home',           label: 'Home',           num: '01' },
    { id: 'about',          label: 'About Me',       num: '02' },
    { id: 'resume',         label: 'Resume',         num: '03' },
    { id: 'certifications', label: 'Certifications', num: '04' },
    { id: 'project',        label: 'Projects',       num: '05' },
    { id: 'service',        label: 'Skills',         num: '06' },
    { id: 'blog',           label: 'Blog',           num: '07' },
    { id: 'contact',        label: 'Contact',        num: '08' },
  ];

  // Quote of the day
  private readonly quotes = [
    { text: "What we observe is not nature itself, but nature exposed to our method of questioning.", author: "— Werner Heisenberg" },
    { text: "If you can't measure it, you can't improve it.", author: "— Lord Kelvin" },
    { text: "The most incomprehensible thing about the world is that it is comprehensible.", author: "— Albert Einstein" },
    { text: "An experiment is a question which science poses to nature, and a measurement is the recording of nature's answer.", author: "— Max Planck" },
    { text: "In mathematics you don't understand things. You just get used to them.", author: "— John von Neumann" },
    { text: "The good thing about science is that it's true whether or not you believe in it.", author: "— Neil deGrasse Tyson" },
    { text: "Equipped with his five senses, man explores the universe around him and calls the adventure science.", author: "— Edwin Hubble" },
    { text: "The art of doing mathematics consists in finding that special case which contains all the germs of generality.", author: "— David Hilbert" },
    { text: "Nature uses only the longest threads to weave her patterns, so each small piece of her fabric reveals the organization of the entire tapestry.", author: "— Richard Feynman" },
    { text: "Everything should be made as simple as possible, but not simpler.", author: "— Albert Einstein" },
    { text: "The measure of intelligence is the ability to change.", author: "— Charles Darwin" },
    { text: "Somewhere, something incredible is waiting to be known.", author: "— Carl Sagan" },
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  private readonly updateViewportSize = (): void => {
    const w = window.visualViewport?.width  ?? window.innerWidth;
    const h = window.visualViewport?.height ?? window.innerHeight;
    document.documentElement.style.setProperty('--device-width',  `${w}px`);
    document.documentElement.style.setProperty('--device-height', `${h}px`);
    
    // Adjust scroll height dynamically based on vertical width and height to guarantee scroll range
    const scrollRangeFactor = w < 768 ? 2.2 : 1.8;
    const minSvgHeight = h * scrollRangeFactor;
    document.documentElement.style.setProperty('--svg-min-height', `${minSvgHeight}px`);
    
    // Dynamically adjust horizontal distance between nodes based on viewport
    this.horizontalSpan = Math.min(560, Math.max(460, w * 0.42));

    if (this.zoomedSectionId) {
      this.zoomInto(this.zoomedSectionId);
    }

    setTimeout(() => this.findNodeFractions(), 50);
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this.zoomedSectionId) {
      this.zoomOut();
    }
  };

  ngOnInit(): void {
    this.updateViewportSize();
    window.addEventListener('resize', this.updateViewportSize, { passive: true });
    window.visualViewport?.addEventListener('resize', this.updateViewportSize, { passive: true });
    window.addEventListener('keydown', this.onKeyDown);

    // Subscribe to navigation bus
    this.navSub = sectionNav$.subscribe((id) => {
      if (id === 'map') {
        this.zoomOut();
      } else {
        const matchingSlide = this.slideList.find(s => s.id === id);
        if (matchingSlide) {
          this.zoomInto(matchingSlide.id);
        } else {
          this.zoomOut();
        }
      }
    });

    // No background gif preloading needed
  }

  // Removed preloadBackgroundGif method

  ngAfterViewInit(): void {
    const path = window.location.pathname.replace('/', '') || 'map';
    if (this.slideList.some(s => s.id === path)) {
      setTimeout(() => this.zoomInto(path), 100);
    }
    this.initCursor();
    this.initPreloader();

    // Start video scrub rendering loop and initialize start frame
    if (this.scrollerVideoRef) {
      this.scrollerVideoRef.nativeElement.currentTime = 0.2;
    }
    this.startVideoScrubLoop();

    setTimeout(() => this.findNodeFractions(), 200);
  }

  startNameMorphAnimation(): void {
    const target = "Satish Pakalapati";
    const southChars = [
      'స','తీ','ष्','ప','క','ల','ప','తి',
      'ச','தீ','ஷ்','ப','க','ல','ப','தி',
      'ಸ','ತೀ','ಶ್','ಪ','ಕ','ಲ','ಪ','ತಿ',
      'സ','തീ','ഷ്','പ','ക','ല','പ','തി'
    ];
    
    let currentStep = 0;
    const totalSteps = 45;
    const intervalTime = 45; // ms
    
    const timer = setInterval(() => {
      let result = '';
      for (let i = 0; i < target.length; i++) {
        if (target[i] === ' ') {
          result += ' ';
          continue;
        }
        
        const settleThreshold = (i / target.length) * totalSteps;
        if (currentStep > settleThreshold + 6) {
          result += target[i];
        } else {
          const randChar = southChars[Math.floor(Math.random() * southChars.length)];
          result += randChar;
        }
      }
      
      this.displayName = result;
      this.cdr.detectChanges();
      currentStep++;
      
      if (currentStep >= totalSteps + 10) {
        this.displayName = target;
        this.cdr.detectChanges();
        clearInterval(timer);
      }
    }, intervalTime);
  }

  startPortfolioMorphAnimation(): void {
    const target = "Portfolio";
    const southChars = [
      'స','తీ','ष्','ప','ಕ','ಲ','ப','தி',
      'ச','தீ','ஷ்','ப','ക','ല','ಪ','ತಿ',
      'ಸ','ತೀ','ಶ್','ಪ','ല','പ','തി',
      'സ','തീ','ഷ്','പ'
    ];
    
    let currentStep = 0;
    const totalSteps = 35;
    const intervalTime = 45; // ms
    
    const timer = setInterval(() => {
      let result = '';
      for (let i = 0; i < target.length; i++) {
        const settleThreshold = (i / target.length) * totalSteps;
        if (currentStep > settleThreshold + 4) {
          result += target[i];
        } else {
          const randChar = southChars[Math.floor(Math.random() * southChars.length)];
          result += randChar;
        }
      }
      
      this.displayPortfolio = result;
      this.cdr.detectChanges();
      currentStep++;
      
      if (currentStep >= totalSteps + 8) {
        this.displayPortfolio = target;
        this.cdr.detectChanges();
        clearInterval(timer);
      }
    }, intervalTime);
  }

  findNodeFractions(): void {
    const path = this.litPathRef?.nativeElement;
    if (!path) return;

    const numNodes = this.slideList.length;
    const lx = this.lx;
    const rx = this.rx;
    const mx = this.mx;

    const nodeCoords = [
      { x: lx, y: 80 },
      { x: rx, y: 180 },
      { x: rx, y: 540 },
      { x: lx, y: 640 },
      { x: lx, y: 1000 },
      { x: rx, y: 1100 },
      { x: rx, y: 1460 },
      { x: mx, y: 1640 }
    ];

    const totalLen = path.getTotalLength();
    if (totalLen <= 0) return;

    const steps = 300;
    const bestLengths = new Array(numNodes).fill(0);
    const minDists = new Array(numNodes).fill(Infinity);

    for (let i = 0; i <= steps; i++) {
      const len = (i / steps) * totalLen;
      const pt = path.getPointAtLength(len);
      
      for (let n = 0; n < numNodes; n++) {
        const dx = pt.x - nodeCoords[n].x;
        const dy = pt.y - nodeCoords[n].y;
        const dist = dx * dx + dy * dy;
        if (dist < minDists[n]) {
          minDists[n] = dist;
          bestLengths[n] = len;
        }
      }
    }

    for (let n = 0; n < numNodes; n++) {
      this.snakeNodeFractions[n] = bestLengths[n] / totalLen;
    }

    this.snakePathTotalLength = totalLen;
    this.snakePathLength = totalLen;
    
    if (!this.firstLoadDone) {
      const defaultFraction = this.snakeNodeFractions[0];
      this.snakePathOffset = totalLen * (1 - defaultFraction);
      this.firstLoadDone = true;
      this.isInitialDrawing = false;
      this.cdr.detectChanges();
    } else {
      if (this.hoveredNodeIdx === null) {
        const defaultFraction = this.snakeNodeFractions[0];
        this.snakePathOffset = totalLen * (1 - defaultFraction);
      } else {
        const fraction = this.snakeNodeFractions[this.hoveredNodeIdx];
        this.snakePathOffset = totalLen * (1 - fraction);
      }
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.updateViewportSize);
    window.visualViewport?.removeEventListener('resize', this.updateViewportSize);
    window.removeEventListener('keydown', this.onKeyDown);
    if (this.navSub) {
      this.navSub.unsubscribe();
    }
    cancelAnimationFrame(this.raf);
    if (this.videoScrubFrameId) {
      cancelAnimationFrame(this.videoScrubFrameId);
    }
    window.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseleave', this.onMouseLeave);
    document.removeEventListener('mouseenter', this.onMouseEnter);
    if (this.audio) {
      this.audio.pause();
    }
  }

  private onMouseMove  = (e: MouseEvent) => { this.cx = e.clientX; this.cy = e.clientY; };
  private onMouseLeave = () => this.cursorEl.nativeElement.classList.remove('cursor--visible');
  private onMouseEnter = () => this.cursorEl.nativeElement.classList.add('cursor--visible');

  private initCursor(): void {
    const el = this.cursorEl.nativeElement;

    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    document.addEventListener('mouseleave', this.onMouseLeave);
    document.addEventListener('mouseenter', this.onMouseEnter);

    // show on first move
    window.addEventListener('mousemove', () => el.classList.add('cursor--visible'), { once: true });

    const hoverSel = 'a, button, [role="button"], input, textarea, select, label, .landing-card, .hud-back-btn, .hud-nav-btn, .progress-dot, .toast-btn';
    document.addEventListener('mouseover', (e) => {
      if ((e.target as Element).closest(hoverSel)) el.classList.add('cursor--hover');
    }, { passive: true });
    document.addEventListener('mouseout', (e) => {
      if ((e.target as Element).closest(hoverSel)) el.classList.remove('cursor--hover');
    }, { passive: true });

    const tick = () => {
      this.raf = requestAnimationFrame(tick);
      el.style.transform = `translate(${this.cx}px, ${this.cy}px)`;
    };
    tick();
  }

  private initPreloader(): void {
    const preloader = this.preloaderEl.nativeElement;
    const quoteEl   = this.quoteEl.nativeElement;
    const authorEl  = this.authorEl.nativeElement;
    const bar       = this.barEl.nativeElement;

    const q = this.quotes[Math.floor(Math.random() * this.quotes.length)];
    authorEl.textContent = q.author;

    const words = q.text.split(' ');
    let wordIdx = 0;

    const nextWord = () => {
      if (wordIdx >= words.length) {
        bar.style.transition = 'width 0.6s ease';
        bar.style.width = '100%';
        setTimeout(() => {
          authorEl.classList.add('show');
          setTimeout(() => {
            preloader.classList.add('preloader--hidden');
            // Mute music by default, initialize silently
            this.initAudio(false);
            
            // Start the name and portfolio morph animations exactly when map is revealed
            this.startNameMorphAnimation();
            this.startPortfolioMorphAnimation();
          }, 2000);
        }, 700);
        return;
      }
      const word = words[wordIdx];
      quoteEl.textContent = words.slice(0, wordIdx + 1).join(' ');
      bar.style.transition = 'width 0.25s linear';
      bar.style.width = `${((wordIdx + 1) / words.length) * 90}%`;
      wordIdx++;

      let delay = 220;
      if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) delay = 900;
      else if (word.endsWith(',') || word.endsWith(';') || word.endsWith(':')) delay = 500;

      setTimeout(nextWord, delay);
    };

    nextWord();
  }

  // Audio Control Methods
  enableImmersive(enable: boolean): void {
    this.showImmersiveModal = false;
    this.initAudio(enable);
  }

  private initAudio(play: boolean): void {
    if (this.audioInitialized) return;
    this.audio = new Audio('/backgroundscore.mp3');
    this.audio.loop = true;
    this.audio.volume = 0.45;
    this.audioMuted = true; // Always start muted
    this.audio.muted = true;
    this.audioInitialized = true;
    
    // Call play() immediately on the muted audio to start it silently
    this.audio.play().catch(err => {
      console.warn('Audio Muted Autoplay Blocked:', err);
    });
    this.cdr.detectChanges();
  }

  toggleAudio(): void {
    if (!this.audio) {
      this.initAudio(true);
      return;
    }
    this.audioMuted = !this.audioMuted;
    this.audio.muted = this.audioMuted;
    if (!this.audioMuted) {
      this.audio.play().catch(err => console.warn(err));
    }
    this.cdr.detectChanges();
  }

  onScrollWheel(event: WheelEvent): void {
    if (event.deltaY !== 0) {
      event.preventDefault();
      const container = event.currentTarget as HTMLElement;
      container.scrollLeft += event.deltaY * 0.85;
    }
  }

  zoomInto(id: string): void {
    this.zoomedSectionId = id;

    // Update history state
    const nextPath = `/${id}`;
    if (window.location.pathname !== nextPath) {
      history.pushState(null, '', nextPath);
    }

    // Calculate dynamic zoom origin from the SVG circle node's viewport position
    // This makes the camera appear to "fly through" the clicked circle
    let originX = 50;
    let originY = 50;

    const nodeEl = document.querySelector(`[data-slide-id="${id}"]`);
    if (nodeEl) {
      const rect = nodeEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        // Center of the element in viewport percentage
        originX = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
        originY = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
      }
    }

    const viewport = document.querySelector('.zoom-viewport') as HTMLElement;
    if (viewport) {
      viewport.style.setProperty('--zoom-origin-x', `${originX}%`);
      viewport.style.setProperty('--zoom-origin-y', `${originY}%`);
    }

    this.cdr.detectChanges();
  }

  zoomOut(): void {
    this.zoomedSectionId = null;

    // Update history state
    const nextPath = `/map`;
    if (window.location.pathname !== nextPath) {
      history.pushState(null, '', nextPath);
    }

    // Reset inner scroll positions of zoomed slides
    document.querySelectorAll('.slide-content-scroller').forEach((el) => {
      el.scrollTop = 0;
    });

    this.cdr.detectChanges();
  }

  goToPrevSlide(): void {
    if (!this.zoomedSectionId) return;
    const idx = this.slideList.findIndex(s => s.id === this.zoomedSectionId);
    if (idx === -1) return;
    const prevIdx = (idx - 1 + this.slideList.length) % this.slideList.length;
    this.zoomInto(this.slideList[prevIdx].id);
  }

  goToNextSlide(): void {
    if (!this.zoomedSectionId) return;
    const idx = this.slideList.findIndex(s => s.id === this.zoomedSectionId);
    if (idx === -1) return;
    const nextIdx = (idx + 1) % this.slideList.length;
    this.zoomInto(this.slideList[nextIdx].id);
  }

  // Scroll handler for scrubbing scroller.mp4
  onLandingScroll(event: Event): void {
    const container = event.currentTarget as HTMLElement;
    const scrollTop = container.scrollTop;
    const maxScroll = container.scrollHeight - container.clientHeight;
    
    if (maxScroll > 0) {
      const scrollRatio = scrollTop / maxScroll;
      if (this.scrollerVideoRef) {
        const video = this.scrollerVideoRef.nativeElement;
        const duration = video.duration || 10;
        const start = 0.2; // play from 0.2 seconds
        this.targetVideoTime = start + scrollRatio * (duration - start);
      }
    }
  }

  // Smooth video scrub animation loop
  private startVideoScrubLoop(): void {
    let lastSeekTime = 0;
    const tick = () => {
      if (this.scrollerVideoRef) {
        const video = this.scrollerVideoRef.nativeElement;
        const now = performance.now();
        // Check readystate, ensure not currently seeking, and throttle seeks to 25 seek/sec max (40ms throttle)
        if (video.readyState >= 2 && !video.seeking && (now - lastSeekTime > 40)) {
          const diff = this.targetVideoTime - video.currentTime;
          if (Math.abs(diff) > 0.02) {
            // Seek directly to the target time to eliminate trailing lag and intermediate seek queuing
            video.currentTime = this.targetVideoTime;
            lastSeekTime = now;
          }
        }
      }
      this.videoScrubFrameId = requestAnimationFrame(tick);
    };
    tick();
  }
}

