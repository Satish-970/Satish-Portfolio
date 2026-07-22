import { Component, OnInit, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioSynthService } from '../../shared/audio-synth.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" 
         class="fixed inset-0 z-[9999] flex flex-col justify-between p-8 md:p-12 bg-[#02040c] text-white font-mono transition-opacity duration-1000 overflow-hidden"
         [class.opacity-0]="faded"
         [class.pointer-events-none]="faded">
      
      <!-- Scanline overlay aesthetic -->
      <div class="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]"></div>
      
      <!-- Top Diagnostic Row -->
      <div class="flex justify-between items-start z-10 text-[10px] uppercase text-[#7a8099] border-b border-[rgba(0,240,255,0.15)] pb-4">
        <div>
          <div>SYSTEM: DETECTED // PORT: 443</div>
          <div>CORE: ACTIVE // AGENT: ANTIGRAVITY</div>
        </div>
        <div class="text-right">
          <div>LOC: OBSERVATORY_DOME</div>
          <div>LATENCY: 14MS // FPS: 60</div>
        </div>
      </div>

      <!-- Center Branding & Loading Controls -->
      <div class="flex flex-col items-center justify-center text-center my-auto z-10">
        <h1 class="text-3xl md:text-5xl font-black tracking-[0.25em] text-[#00f0ff] uppercase glow-title font-sans mb-2 select-none">
          SATISH ANALYTICS LAB
        </h1>
        <p class="text-xs md:text-sm tracking-[0.4em] text-[#7a8099] uppercase mb-12 select-none">
          Data • Engineering • Analytics • Experiences
        </p>

        <!-- Dynamic Console Log Feed -->
        <div class="w-full max-w-lg h-36 border border-[rgba(0,240,255,0.15)] bg-[rgba(5,8,17,0.7)] backdrop-blur-md p-4 rounded text-left overflow-y-auto text-xs leading-relaxed scrollbar-thin select-none">
          <div *ngFor="let log of displayedLogs" class="text-[rgba(0,240,255,0.85)] flex gap-2">
            <span class="text-[#7a8099]">></span>
            <span>{{ log }}</span>
          </div>
          <div class="animate-pulse inline-block w-1.5 h-3 bg-[#00f0ff] ml-1 mt-1"></div>
        </div>

        <!-- Initiate / Enter Trigger -->
        <div class="mt-12 h-14 flex items-center justify-center">
          <button *ngIf="progress === 100" 
                  (click)="enterLab()"
                  (mouseenter)="playHoverSFX()"
                  class="cursor-pointer px-8 py-3 border border-[#00f0ff] bg-[rgba(0,240,255,0.1)] hover:bg-[#00f0ff] hover:text-[#02040c] transition-all duration-300 rounded font-bold uppercase tracking-wider text-xs md:text-sm shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            ENTER OBSERVATORY
          </button>

          <span *ngIf="progress < 100" class="text-xs text-[#7a8099] tracking-widest animate-pulse">
            CALIBRATING NEURAL CHANNELS...
          </span>
        </div>
      </div>

      <!-- Bottom Progress Indicators -->
      <div class="w-full flex flex-col gap-2 z-10">
        <div class="flex justify-between text-xs tracking-widest text-[#7a8099]">
          <span>GRID ENGINE INTENSITY</span>
          <span>{{ progress }}%</span>
        </div>
        
        <!-- Glass Bar Container -->
        <div class="w-full h-[6px] bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden border border-[rgba(0,240,255,0.1)]">
          <div class="h-full bg-gradient-to-r from-[#00f0ff] to-[#9000ff] transition-all duration-300 ease-out shadow-[0_0_10px_rgba(0,240,255,0.6)]" 
               [style.width]="progress + '%'"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .glow-title {
      text-shadow: 0 0 15px rgba(0, 240, 255, 0.4), 0 0 30px rgba(0, 240, 255, 0.15);
    }
    .scrollbar-thin::-webkit-scrollbar {
      width: 4px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: rgba(0, 240, 255, 0.2);
      border-radius: 4px;
    }
  `]
})
export class LoaderComponent implements OnInit {
  @Output() completed = new EventEmitter<void>();

  private audioService = inject(AudioSynthService);
  private cdr = inject(ChangeDetectorRef);

  visible = true;
  faded = false;
  progress = 0;
  displayedLogs: string[] = [];

  private logs = [
    'Initializing Satish Analytics Lab...',
    'Loading WebGL core visualization modules...',
    'Compiling background shader programs...',
    'Mapping spatial rooms interpolation matrix...',
    'Parsing projects observatory metadata...',
    'Loading core full-stack skillset variables...',
    'Validating professional credentials & timeline parameters...',
    'Synthesizing ambient drone frequency oscillator...',
    'Calibrating interactive UI controls...',
    'Environment ready // Laboratory accessible.'
  ];

  ngOnInit(): void {
    this.runLoadingSimulation();
  }

  private runLoadingSimulation(): void {
    const totalSteps = this.logs.length;
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < totalSteps) {
        this.displayedLogs.push(this.logs[currentStep]);
        currentStep++;
        this.progress = Math.min(Math.floor((currentStep / totalSteps) * 100), 100);
      } else {
        clearInterval(interval);
        this.progress = 100;
      }
      this.cdr.detectChanges();
    }, 450); // Fast log feeding
  }

  enterLab(): void {
    this.audioService.init(); // Initialize dynamic synthesizer drone
    this.audioService.playSelectClick(); // Click SFX
    
    // Smooth fade out
    this.faded = true;
    setTimeout(() => {
      this.visible = false;
      this.completed.emit();
    }, 1000);
  }

  playHoverSFX(): void {
    this.audioService.playHoverTick();
  }
}
