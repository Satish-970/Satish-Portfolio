import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioSynthService {
  private audioCtx: AudioContext | null = null;
  
  // Audio Nodes
  private masterGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private lfo: OscillatorNode | null = null;

  // Configuration & Signals
  private volumeLevel = 0.35; // Default target volume
  public isPlaying = signal<boolean>(false);
  public volume = signal<number>(this.volumeLevel);
  public isMuted = signal<boolean>(true); // Start muted by default to comply with browser autoplay rules

  constructor() {
    // React to volume / mute signals
    effect(() => {
      const vol = this.volume();
      const muted = this.isMuted();
      this.updateGain(muted ? 0 : vol);
    });
  }

  public init(): void {
    if (this.audioCtx) return;
    
    // Create AudioContext
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.audioCtx = new AudioContextClass();
    
    // Setup Nodes
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.audioCtx.currentTime); // start silent
    this.masterGain.connect(this.audioCtx.destination);

    // Setup Resonant Lowpass Filter (for that warm space drone sound)
    this.filter = this.audioCtx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.Q.setValueAtTime(3.5, this.audioCtx.currentTime);
    this.filter.frequency.setValueAtTime(280, this.audioCtx.currentTime);
    this.filter.connect(this.masterGain);

    // Create a slow LFO to sweep the filter cutoff (creates organic texture)
    this.lfo = this.audioCtx.createOscillator();
    this.lfo.frequency.setValueAtTime(0.08, this.audioCtx.currentTime); // very slow sweep: 12 seconds
    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.setValueAtTime(140, this.audioCtx.currentTime); // sweep width (in Hz)
    
    this.lfo.connect(lfoGain);
    if (this.filter.frequency) {
      lfoGain.connect(this.filter.frequency);
    }
    this.lfo.start();

    // Start Evolving Space Drone (Chord pad C2, G2, C3, E3, Bb3, D4)
    const baseNotes = [65.41, 98.00, 130.81, 164.81, 233.08, 293.66];
    baseNotes.forEach((freq, idx) => {
      const osc = this.audioCtx!.createOscillator();
      // Mix saw and triangle wave oscillators for rich harmonized content
      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx!.currentTime);

      // Micro-detuning to create a lush, natural chorus effect
      osc.detune.setValueAtTime((Math.random() - 0.5) * 15, this.audioCtx!.currentTime);

      const oscGain = this.audioCtx!.createGain();
      oscGain.gain.setValueAtTime(0.08 / baseNotes.length, this.audioCtx!.currentTime); // keep individual oscillators quiet

      // Add soft LFO amplitude modulation to individual voices
      const voiceLfo = this.audioCtx!.createOscillator();
      voiceLfo.frequency.setValueAtTime(0.1 + Math.random() * 0.15, this.audioCtx!.currentTime);
      const voiceLfoGain = this.audioCtx!.createGain();
      voiceLfoGain.gain.setValueAtTime(0.02 / baseNotes.length, this.audioCtx!.currentTime);
      
      voiceLfo.connect(voiceLfoGain);
      voiceLfoGain.connect(oscGain.gain);
      
      osc.connect(oscGain);
      oscGain.connect(this.filter!);
      
      osc.start();
      voiceLfo.start();
      this.oscillators.push(osc);
    });

    this.isPlaying.set(true);
    // Smoothly fade in volume if not muted
    if (!this.isMuted()) {
      this.updateGain(this.volume());
    }
  }

  private updateGain(targetValue: number): void {
    if (!this.audioCtx || !this.masterGain) return;
    
    const rampTime = 1.5; // Smooth fade transition over 1.5s
    this.masterGain.gain.linearRampToValueAtTime(targetValue, this.audioCtx.currentTime + rampTime);
  }

  public toggleMute(): void {
    if (this.isMuted()) {
      // Unmuting
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      this.init(); // Make sure context is initialized
      this.isMuted.set(false);
      this.playSelectClick();
    } else {
      // Muting
      this.isMuted.set(true);
      this.playHoverTick();
    }
  }

  public setVolume(level: number): void {
    this.volume.set(level);
  }

  // Sound FX: Holographic UI ticks (mechanical tick-tick feedback)
  public playHoverTick(): void {
    if (!this.audioCtx || this.isMuted()) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.audioCtx.currentTime + 0.015);

      gain.gain.setValueAtTime(0.015, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.015);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.02);
    } catch (e) {
      // Audio not yet fully activated
    }
  }

  public playSelectClick(): void {
    if (!this.audioCtx || this.isMuted()) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.040);

      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.040);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.05);
    } catch (e) {
      // Audio not yet active
    }
  }
}
