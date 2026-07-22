import { Component, OnInit, OnDestroy, AfterViewInit, signal, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';
import { ObservatoryCanvasComponent } from './components/observatory-canvas/observatory-canvas.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ResumeComponent } from './components/resume/resume.component';
import { ContactComponent } from './components/contact/contact.component';
import { AudioWidgetComponent } from './components/audio-widget/audio-widget.component';
import { ThreeSceneService } from './shared/three-scene.service';
import gsap from 'gsap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    ObservatoryCanvasComponent,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    ProjectsComponent,
    SkillsComponent,
    ResumeComponent,
    ContactComponent,
    AudioWidgetComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  private threeService = inject(ThreeSceneService);
  private cdr = inject(ChangeDetectorRef);

  loading = signal(true);
  activeRoom = signal(0);
  
  // Custom custom cursor position trackers
  cursorX = 0;
  cursorY = 0;
  cursorVisible = false;

  private scrollListener?: () => void;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.initMouseTracker();
    }
  }

  ngAfterViewInit(): void {
    // Scroll coordinates setup on resize
    this.updateViewportSize();
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      if (this.scrollListener) {
        window.removeEventListener('scroll', this.scrollListener);
      }
      window.removeEventListener('resize', this.updateViewportSize);
    }
  }

  onLoaderComplete(): void {
    this.loading.set(false);
    this.cdr.detectChanges();
    
    // Once loader closes, initialize scroll timeline and reveal DOM elements
    setTimeout(() => {
      this.initScrollTimeline();
    }, 100);
  }

  private initScrollTimeline(): void {
    if (typeof window === 'undefined') return;

    this.scrollListener = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

      // Update Three.js camera pathway position signal
      this.threeService.currentScroll.set(progress);

      // Slide HTML rooms horizontally via GSAP. There are 7 segment screen widths, so we translate from 0% to -600%.
      gsap.to('.horizontal-scroll-container', {
        xPercent: -progress * 600,
        ease: 'power2.out',
        overwrite: 'auto',
        duration: 0.6
      });

      // Update HUD active section index
      const activeIdx = Math.min(Math.floor(progress * 7), 6);
      let activeRoomIdx = activeIdx;
      if (activeIdx === 5) activeRoomIdx = 4; // Timeline is part of credentials HUD segment
      if (activeIdx === 6) activeRoomIdx = 5; // SSH Terminal is final HUD segment
      this.activeRoom.set(activeRoomIdx);
      this.cdr.detectChanges();
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
    window.addEventListener('resize', this.updateViewportSize.bind(this), { passive: true });
  }

  onRoomSelect(roomIndex: number): void {
    if (typeof window === 'undefined') return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    // Map room index back to segments:
    // Room 0 (Landing) -> segment 0
    // Room 1 (Profile) -> segment 1
    // Room 2 (Observatory) -> segment 2
    // Room 3 (Skills) -> segment 3
    // Room 4 (Credentials) -> segment 4
    // Room 5 (Terminal) -> segment 6
    let segmentIndex = roomIndex;
    if (roomIndex === 5) segmentIndex = 6;

    const targetScroll = (segmentIndex / 6) * maxScroll;

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  }

  private updateViewportSize = (): void => {
    if (typeof window === 'undefined') return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    document.documentElement.style.setProperty('--device-width', `${w}px`);
    document.documentElement.style.setProperty('--device-height', `${h}px`);
  };

  // Holographic custom pointer tracker (Arrow style)
  private initMouseTracker(): void {
    window.addEventListener('mousemove', (e) => {
      this.cursorX = e.clientX;
      this.cursorY = e.clientY;
      this.cursorVisible = true;
    }, { passive: true, once: true });

    window.addEventListener('mousemove', (e) => {
      this.cursorX = e.clientX;
      this.cursorY = e.clientY;
    }, { passive: true });

    document.addEventListener('mouseleave', () => this.cursorVisible = false);
    document.addEventListener('mouseenter', () => this.cursorVisible = true);
  }
}
