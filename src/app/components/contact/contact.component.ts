import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AudioSynthService } from '../../shared/audio-synth.service';

type ContactStatus = '' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative w-[100vw] h-full flex flex-col justify-center items-center px-6 md:px-16 overflow-hidden bg-transparent select-none" id="contact">
      <!-- Section Label HUD -->
      <div class="absolute top-12 left-12 flex items-center gap-3">
        <span class="w-2.5 h-2.5 bg-[#00f0ff] rounded-full animate-ping"></span>
        <span class="font-mono text-xs text-[#00f0ff] tracking-[0.3em] uppercase">O-07 // SECURE CONSOLE</span>
      </div>

      <div class="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch z-10">
        <!-- Left Side: Terminal Diagnostics & Meta -->
        <div class="flex flex-col justify-between p-6 bg-[rgba(10,15,30,0.4)] border border-[rgba(0,240,255,0.15)] rounded-lg backdrop-blur-md">
          <div class="font-mono">
            <div class="flex items-center gap-2 mb-4">
              <span class="w-2 h-2 rounded-full bg-[#ef4444]"></span>
              <span class="w-2 h-2 rounded-full bg-[#eab308]"></span>
              <span class="w-2 h-2 rounded-full bg-[#22c55e]"></span>
              <span class="text-[9px] text-[#7a8099] uppercase ml-2">NODE_DIAGNOSTICS // HOST_SATISH</span>
            </div>
            
            <h3 class="text-sm font-bold text-[#00f0ff] uppercase tracking-wider mb-2">Lab Connection Established</h3>
            <p class="text-xs text-[#7a8099] leading-relaxed mb-6">
              Establish a direct telemetry link. Send inquiries, coordinates, or project parameters. Responses will resolve through standard SMTP channels.
            </p>

            <div class="space-y-3 text-[10px] text-[#7a8099] uppercase">
              <div class="flex justify-between border-b border-[rgba(0,240,255,0.08)] pb-1.5">
                <span>LOCAL_PORT:</span>
                <span class="text-white">443 / SSL</span>
              </div>
              <div class="flex justify-between border-b border-[rgba(0,240,255,0.08)] pb-1.5">
                <span>EMAIL:</span>
                <a href="mailto:satishpakalapati65@gmail.com" (mouseenter)="playHover()" class="text-white hover:text-[#00f0ff] lowercase transition-colors duration-200">satishpakalapati65&#64;gmail.com</a>
              </div>
              <div class="flex justify-between border-b border-[rgba(0,240,255,0.08)] pb-1.5">
                <span>STATUS:</span>
                <span class="text-[#22c55e] animate-pulse">AVAILABLE FOR INQUIRIES</span>
              </div>
            </div>
          </div>

          <!-- Bottom Branding -->
          <div class="mt-8 font-mono text-[9px] text-[#7a8099]">
            SATISH PAKALAPATI // SYSTEMS REDESIGN ©2026
          </div>
        </div>

        <!-- Right Side: Interactive Terminal Form -->
        <div class="bg-[rgba(5,8,17,0.75)] border border-[rgba(0,240,255,0.25)] rounded-lg shadow-[0_0_30px_rgba(0,240,255,0.1)] overflow-hidden flex flex-col">
          <!-- Terminal Header Bar -->
          <div class="flex items-center justify-between px-4 py-2.5 bg-[rgba(10,15,30,0.8)] border-b border-[rgba(0,240,255,0.15)] font-mono text-[10px] text-[#7a8099]">
            <span>ssh-session // contact&#64;satishpakalapati.com</span>
            <span class="text-[#00f0ff] animate-pulse">● SECURE</span>
          </div>

          <!-- Terminal Content -->
          <form class="p-6 flex-1 flex flex-col justify-between font-mono text-xs" (submit)="submitContact($event)">
            <div class="space-y-4">
              <!-- Shell Welcome Msg -->
              <div class="text-[#7a8099]">
                $ login guest_agent_user... OK<br/>
                $ ready for transmission...
              </div>

              <!-- Name Input Line -->
              <div class="flex items-center gap-2 border-b border-[rgba(0,240,255,0.1)] pb-1">
                <span class="text-[#00f0ff] shrink-0">$ NAME:</span>
                <input name="name" type="text" required (mouseenter)="playHover()"
                       class="w-full bg-transparent border-none outline-none text-white focus:ring-0 placeholder-[#7a8099]"
                       placeholder="[ Enter full sender name ]" />
              </div>

              <!-- Email Input Line -->
              <div class="flex items-center gap-2 border-b border-[rgba(0,240,255,0.1)] pb-1">
                <span class="text-[#00f0ff] shrink-0">$ EMAIL:</span>
                <input name="email" type="email" required (mouseenter)="playHover()"
                       class="w-full bg-transparent border-none outline-none text-white focus:ring-0 placeholder-[#7a8099]"
                       placeholder="[ Enter transmitter email address ]" />
              </div>

              <!-- Message Input Line -->
              <div class="flex flex-col gap-2 border-b border-[rgba(0,240,255,0.1)] pb-1">
                <span class="text-[#00f0ff]">$ MESSAGE_BODY:</span>
                <textarea name="message" rows="3" required (mouseenter)="playHover()"
                          class="w-full bg-transparent border-none outline-none text-white focus:ring-0 placeholder-[#7a8099] resize-none"
                          placeholder="[ Input payload text - min 10 chars ]"></textarea>
              </div>

              <!-- Real-time Console Log Feedback Box -->
              <div *ngIf="terminalLogs.length > 0" class="p-3 bg-[rgba(2,4,12,0.85)] border border-[rgba(0,240,255,0.15)] rounded text-[10px] text-[#00f0ff] leading-relaxed">
                <div *ngFor="let log of terminalLogs">> {{ log }}</div>
              </div>
            </div>

            <!-- Terminal Run Buttons -->
            <div class="mt-6 flex flex-col gap-3">
              <div *ngIf="contactStatus === 'error'" class="text-rose-400 text-[10px] uppercase font-bold">
                !! ERROR: {{ contactError }}
              </div>
              
              <button type="submit" 
                      [disabled]="contactStatus === 'loading' || contactStatus === 'success'"
                      (mouseenter)="playHover()"
                      class="cursor-pointer w-full text-center py-2.5 border border-[#00f0ff] bg-[rgba(0,240,255,0.06)] hover:bg-[#00f0ff] hover:text-[#02040c] text-white font-mono text-xs uppercase tracking-widest transition-all duration-300 rounded shadow-[0_0_15px_rgba(0,240,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed">
                {{ contactStatus === 'loading' ? 'EXECUTING...' : '[ RUN SEND_PAYLOAD ]' }}
              </button>
            </div>
          </form>
        </div>
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
export class ContactComponent {
  private audioService = inject(AudioSynthService);

  contactStatus: ContactStatus = '';
  contactError = '';
  terminalLogs: string[] = [];

  submitContact(event: Event): void {
    event.preventDefault();
    this.audioService.playSelectClick();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = String(formData.get('email') ?? '');
    const message = String(formData.get('message') ?? '');

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
      this.triggerTerminalError('INCOMPATIBLE_EMAIL_STRUCT');
      return;
    }

    if (message.trim().length < 10) {
      this.triggerTerminalError('INSUFFICIENT_PAYLOAD_BYTES');
      return;
    }

    this.runTerminalSubmit(form, formData);
  }

  private triggerTerminalError(code: string): void {
    this.contactStatus = 'error';
    this.contactError = code;
    this.terminalLogs = [`telemetry_link: validation failed [${code}]`];
    window.setTimeout(() => {
      this.contactStatus = '';
      this.terminalLogs = [];
    }, 4000);
  }

  private async runTerminalSubmit(form: HTMLFormElement, formData: FormData): Promise<void> {
    this.contactStatus = 'loading';
    this.terminalLogs = [
      'ssh-tunnel: establishing socket connection to formspree...',
      'ssh-tunnel: compiling payload parameters...'
    ];

    try {
      // Small simulated latency for tech immersion feel
      await new Promise(resolve => setTimeout(resolve, 800));
      
      this.terminalLogs.push('ssh-tunnel: transmitting secure HTTPS payload...');
      
      const response = await fetch('https://formspree.io/f/mvgkywqy', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error('SOCKET_TRANSMIT_FAILURE');

      this.terminalLogs.push('ssh-tunnel: transmit successful! 200 OK');
      this.terminalLogs.push('ssh-tunnel: closing socket connection.');
      this.contactStatus = 'success';
      form.reset();
      
      window.setTimeout(() => {
        this.contactStatus = '';
        this.terminalLogs = [];
      }, 5000);
      
    } catch (e: any) {
      this.contactStatus = 'error';
      this.contactError = e.message || 'SOCKET_TRANSMIT_FAILURE';
      this.terminalLogs.push('!! ERROR: transmit socket aborted abnormally.');
    }
  }

  playHover(): void {
    this.audioService.playHoverTick();
  }
}
