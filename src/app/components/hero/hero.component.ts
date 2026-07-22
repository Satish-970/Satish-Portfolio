import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioSynthService } from '../../shared/audio-synth.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative w-[100vw] h-full flex flex-col justify-center px-8 md:px-24 select-none bg-transparent" id="home">
      <!-- Section Label HUD -->
      <div class="absolute top-12 left-12 flex items-center gap-3">
        <span class="w-2.5 h-2.5 bg-[#00f0ff] rounded-full animate-ping"></span>
        <span class="font-mono text-xs text-[#00f0ff] tracking-[0.3em] uppercase">L-01 // COLD STARTUP</span>
      </div>

      <div class="max-w-5xl w-full flex flex-col z-10">
        <!-- Floating Status Pill -->
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-[rgba(0,240,255,0.06)] border border-[rgba(0,240,255,0.15)] rounded-full text-[10px] font-mono tracking-widest text-[#00f0ff] uppercase w-fit mb-4">
          <span class="w-1.5 h-1.5 bg-[#00f0ff] rounded-full"></span>
          System Live // Core Connected
        </div>

        <!-- Big Branding -->
        <h1 class="text-4xl md:text-7xl font-black font-sans uppercase tracking-[0.1em] text-white leading-none">
          SATISH <br/>
          <span class="bg-gradient-to-r from-[#00f0ff] to-[#9000ff] bg-clip-text text-transparent">ANALYTICS LAB</span>
        </h1>
        
        <!-- Rotating Subtitle Diagnostics -->
        <div class="mt-4 font-mono text-xs md:text-sm tracking-[0.25em] text-[#7a8099] uppercase flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <span>DATA ANALYST</span>
          <span class="text-[#00f0ff] hidden md:inline">//</span>
          <span>FULL STACK DEVELOPER</span>
          <span class="text-[#00f0ff] hidden md:inline">//</span>
          <span>INTERACTIVE EXPERIENCES</span>
          <span class="text-[#00f0ff] hidden md:inline">//</span>
          <span>ANALYTICS DRIVEN DEVELOPMENT</span>
        </div>

        <!-- Descriptive Readout -->
        <p class="mt-8 text-sm md:text-base text-[#7a8099] leading-relaxed max-w-xl font-mono">
          Fusing analytical processing and machine learning pipelines with high-end React & Angular development. Transforming structured datasets and model constraints into live interactive spaces.
        </p>

        <!-- Command Console Buttons -->
        <div class="mt-12 flex flex-wrap gap-4">
          <button (click)="navigateTo(2)" (mouseenter)="playHoverSFX()"
                  class="cursor-pointer px-6 py-3 border border-[#00f0ff] bg-[rgba(0,240,255,0.05)] hover:bg-[#00f0ff] hover:text-[#02040c] text-white font-mono text-xs uppercase tracking-wider rounded transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
            Explore Portfolio
          </button>
          <button (click)="navigateTo(2)" (mouseenter)="playHoverSFX()"
                  class="cursor-pointer px-6 py-3 border border-[rgba(255,255,255,0.15)] hover:border-[#00f0ff] bg-transparent text-[#7a8099] hover:text-white font-mono text-xs uppercase tracking-wider rounded transition-all duration-300">
            Projects observatory
          </button>
        </div>
      </div>

      <!-- Left Holographic Sidebar Panel (Stripe / Bloomberg layout) -->
      <div class="absolute bottom-12 left-12 hidden xl:flex flex-col gap-1.5 font-mono text-[9px] text-[#7a8099] border-l border-[rgba(0,240,255,0.15)] pl-4">
        <div>LATENCY_MONITOR: 100% RELIABLE</div>
        <div>RENDER_METHOD: WebGL / PointsMaterial</div>
        <div>SPATIAL_INDEX: ROOM_01</div>
        <div>SYSTEM_CLOCK: 2026_ACTIVE</div>
      </div>

      <!-- Right Floating Action Anchors (LinkedIn / GitHub) -->
      <div class="absolute right-12 bottom-12 flex items-center gap-4 z-20">
        <a href="https://github.com/Satish-970" target="_blank" rel="noopener noreferrer" 
           (mouseenter)="playHoverSFX()"
           class="w-10 h-10 border border-[rgba(255,255,255,0.15)] hover:border-[#00f0ff] rounded-full flex items-center justify-center text-[#7a8099] hover:text-[#00f0ff] hover:bg-[rgba(0,240,255,0.06)] transition-all duration-300">
          <i class="ri-github-fill text-lg"></i>
        </a>
        <a href="https://www.linkedin.com/in/satishpakalapati/" target="_blank" rel="noopener noreferrer" 
           (mouseenter)="playHoverSFX()"
           class="w-10 h-10 border border-[rgba(255,255,255,0.15)] hover:border-[#00f0ff] rounded-full flex items-center justify-center text-[#7a8099] hover:text-[#00f0ff] hover:bg-[rgba(0,240,255,0.06)] transition-all duration-300">
          <i class="ri-linkedin-fill text-lg"></i>
        </a>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class HeroComponent {
  @Output() navigate = new EventEmitter<number>();
  private audioService = inject(AudioSynthService);

  navigateTo(roomIndex: number): void {
    this.audioService.playSelectClick();
    this.navigate.emit(roomIndex);
  }

  playHoverSFX(): void {
    this.audioService.playHoverTick();
  }
}
