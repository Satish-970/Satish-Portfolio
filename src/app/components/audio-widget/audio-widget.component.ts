import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioSynthService } from '../../shared/audio-synth.service';

@Component({
  selector: 'app-audio-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-[9995] flex items-center gap-3 px-4 py-2 bg-[rgba(10,15,30,0.4)] border border-[rgba(0,240,255,0.25)] rounded-full backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-[rgba(0,240,255,0.5)] group select-none">
      <!-- Equalizer Visualizer Bars -->
      <div class="flex items-end gap-[3px] h-3 w-4 cursor-pointer" (click)="toggleMute()" (mouseenter)="onHover()">
        <span class="w-[2px] bg-[#00f0ff] rounded-t-full transition-all duration-300" 
              [ngStyle]="{'height': isMuted() ? '2px' : '12px'}" 
              [class.animate-pulse]="!isMuted()"></span>
        <span class="w-[2px] bg-[#00f0ff] rounded-t-full transition-all duration-300" 
              [ngStyle]="{'height': isMuted() ? '2px' : '6px'}" 
              [class.animate-bounce]="!isMuted()"></span>
        <span class="w-[2px] bg-[#00f0ff] rounded-t-full transition-all duration-300" 
              [ngStyle]="{'height': isMuted() ? '2px' : '10px'}" 
              [class.animate-pulse]="!isMuted()"></span>
        <span class="w-[2px] bg-[#00f0ff] rounded-t-full transition-all duration-300" 
              [ngStyle]="{'height': isMuted() ? '2px' : '4px'}" 
              [class.animate-bounce]="!isMuted()"></span>
      </div>

      <!-- Audio Mute Control Button -->
      <button 
        type="button" 
        class="text-xs font-mono tracking-widest text-[#00f0ff] uppercase cursor-pointer hover:text-white transition-colors duration-200"
        (click)="toggleMute()"
        (mouseenter)="onHover()"
      >
        {{ isMuted() ? 'AUDIO: OFF' : 'AUDIO: ON' }}
      </button>

      <!-- Expandable Volume Controls -->
      <div class="flex items-center w-0 overflow-hidden group-hover:w-20 transition-all duration-300 ease-out">
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.05" 
          [value]="volume()" 
          (input)="onVolumeChange($event)"
          (mouseenter)="onHover()"
          class="w-full accent-[#00f0ff] bg-transparent cursor-pointer h-1 rounded-lg appearance-none border-none outline-none"
        />
      </div>
    </div>
  `,
  styles: [`
    /* Vertical pulsing custom animation */
    .animate-pulse {
      animation: pulseHeight 0.8s infinite alternate ease-in-out;
    }
    .animate-bounce {
      animation: pulseHeight 1.1s infinite alternate ease-in-out;
    }
    @keyframes pulseHeight {
      from { height: 2px; }
      to { height: 12px; }
    }
    /* Hide input range styling defaults */
    input[type=range]::-webkit-slider-runnable-track {
      background: rgba(255, 255, 255, 0.1);
      height: 3px;
      border-radius: 9999px;
    }
    input[type=range]::-moz-range-track {
      background: rgba(255, 255, 255, 0.1);
      height: 3px;
      border-radius: 9999px;
    }
  `]
})
export class AudioWidgetComponent {
  private audioService = inject(AudioSynthService);

  isMuted = this.audioService.isMuted;
  volume = this.audioService.volume;

  toggleMute(): void {
    this.audioService.toggleMute();
  }

  onVolumeChange(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    this.audioService.setVolume(value);
    if (this.isMuted()) {
      this.audioService.toggleMute(); // Unmute if slider is touched
    }
  }

  onHover(): void {
    this.audioService.playHoverTick();
  }
}
