import { Component, OnInit, OnDestroy, signal, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioSynthService } from '../../shared/audio-synth.service';

interface NavLink {
  index: number;
  label: string;
  code: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="fixed top-4 left-4 right-4 z-[9990] flex items-center justify-between p-3 bg-[rgba(10,15,30,0.35)] border border-[rgba(0,240,255,0.15)] rounded-lg backdrop-blur-md select-none mx-auto max-w-6xl shadow-xl transition-all duration-300 hover:border-[rgba(0,240,255,0.3)]">
      <!-- HUD Lab Logo/Clock -->
      <div class="flex items-center gap-4 cursor-pointer" (click)="navigateTo(0)">
        <img class="h-8 w-auto rounded border border-[rgba(0,240,255,0.2)]" src="assets/logo.gif" alt="Satish Analytics Lab logo" />
        <div class="hidden sm:flex flex-col font-mono text-[9px] text-[#7a8099]">
          <span class="text-[#00f0ff] font-bold">SATISH ANALYTICS LAB v3.5</span>
          <span>DOME_COORD // ONLINE</span>
        </div>
      </div>

      <!-- Center navigation coordinates -->
      <div class="flex gap-1 md:gap-3">
        <button 
          *ngFor="let link of navLinks" 
          type="button"
          class="cursor-pointer px-2.5 py-1.5 font-mono text-[9px] md:text-xs rounded text-[#7a8099] hover:text-[#00f0ff] transition-all duration-200 border border-transparent hover:border-[rgba(0,240,255,0.15)] hover:bg-[rgba(0,240,255,0.04)]"
          [class.active-hud-item]="activeRoom === link.index"
          (mouseenter)="playHover()"
          (click)="navigateTo(link.index)"
        >
          <span class="text-[#00f0ff] font-bold mr-1">{{ link.code }}</span>
          <span class="hidden md:inline">{{ link.label }}</span>
        </button>
      </div>

      <!-- Right Diagnostics -->
      <div class="flex items-center gap-3">
        <div class="hidden lg:flex flex-col text-right font-mono text-[8px] text-[#7a8099]">
          <div>SECURE_CONN: HTTPS</div>
          <div>STATUS: COMPILING</div>
        </div>
        <div class="w-2.5 h-2.5 bg-[#00f0ff] rounded-full animate-pulse shadow-[0_0_10px_#00f0ff]"></div>
      </div>
    </nav>
  `,
  styles: [`
    .active-hud-item {
      color: #ffffff !important;
      background: rgba(0, 240, 255, 0.08) !important;
      border-color: rgba(0, 240, 255, 0.4) !important;
      box-shadow: 0 0 10px rgba(0, 240, 255, 0.1);
    }
  `]
})
export class NavbarComponent {
  @Input() activeRoom = 0;
  @Output() roomSelect = new EventEmitter<number>();

  private audioService = inject(AudioSynthService);

  readonly navLinks: NavLink[] = [
    { index: 0, code: 'L-01', label: 'LANDING' },
    { index: 1, code: 'A-02', label: 'PROFILE' },
    { index: 2, code: 'P-03', label: 'OBSERVATORY' },
    { index: 3, code: 'S-04', label: 'SKILLS' },
    { index: 4, code: 'C-05', label: 'CREDENTIALS' },
    { index: 5, code: 'T-06', label: 'TERMINAL' }
  ];

  navigateTo(index: number): void {
    this.audioService.playSelectClick();
    this.roomSelect.emit(index);
  }

  playHover(): void {
    this.audioService.playHoverTick();
  }
}
