import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type ContactStatus = '' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section__container contact__container" id="contact">
      <div class="contact-heading">
        <div class="section__tag">Contact</div>
        <h2 class="section__header">Let's <span>Connect</span></h2>
        <p class="section__description">Have a project in mind or just want to chat? I'm always open to new opportunities.</p>
      </div>

      <div class="contact__content">
        <div>
          <h3 class="contact-title">Get in Touch</h3>
          <p class="contact-copy">Whether you have a data challenge, a web project, or just want to connect, my inbox is always open.</p>
          <div class="contact__info-items">
            <a class="contact__info-item" href="mailto:satishpakalapati65@gmail.com"><div class="contact__info-icon"><i class="ri-mail-line"></i></div><div><div class="contact__info-label">Email</div><div class="contact__info-value">satishpakalapati65&#64;gmail.com</div></div></a>
            <a class="contact__info-item" href="https://github.com/Satish-970" target="_blank" rel="noopener noreferrer"><div class="contact__info-icon"><i class="ri-github-line"></i></div><div><div class="contact__info-label">GitHub</div><div class="contact__info-value">github.com/Satish-970</div></div></a>
            <a class="contact__info-item" href="https://www.linkedin.com/in/satishpakalapati/" target="_blank" rel="noopener noreferrer"><div class="contact__info-icon"><i class="ri-linkedin-line"></i></div><div><div class="contact__info-label">LinkedIn</div><div class="contact__info-value">satishpakalapati</div></div></a>
          </div>
          <div class="availability"><span></span>Available for opportunities</div>
        </div>

        <div class="contact__form__wrapper">
          <h2 class="section__header">Send a <span>Message</span></h2>
          <form class="contact__form" (submit)="submitContact($event)">
            <div class="input__row">
              <input name="name" type="text" placeholder="Your Name" required />
              <input name="email" type="email" placeholder="Your Email" required />
            </div>
            <input name="subject" type="text" placeholder="Subject" />
            <textarea name="message" rows="5" placeholder="Your message..." required></textarea>
            <div *ngIf="contactStatus === 'success'" class="contact__submit-status success"><i class="ri-checkbox-circle-line"></i>Message sent! I'll get back to you soon.</div>
            <div *ngIf="contactStatus === 'error'" class="contact__submit-status error"><i class="ri-error-warning-line"></i>{{ contactError }}</div>
            <button type="submit" class="btn" [disabled]="contactStatus === 'loading'" style="position:relative">
              <i *ngIf="contactStatus !== 'loading'" class="ri-send-plane-line"></i>
              <i *ngIf="contactStatus === 'loading'" class="ri-loader-4-line" style="animation:spin 0.8s linear infinite;display:inline-block"></i>
              {{ contactStatus === 'loading' ? 'Sending...' : 'Send Message' }}
            </button>
          </form>
        </div>
      </div>
    </section>
  `,
})
export class ContactComponent {
  contactStatus: ContactStatus = '';
  contactError = '';

  async submitContact(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = String(formData.get('email') ?? '');
    const message = String(formData.get('message') ?? '');

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
      this.showContactError('Please enter a valid email address.');
      return;
    }

    if (message.trim().length < 10) {
      this.showContactError('Message must be at least 10 characters.');
      return;
    }

    this.contactStatus = 'loading';

    try {
      const response = await fetch('https://formspree.io/f/mvgkywqy', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error('Form submit failed');

      form.reset();
      this.contactStatus = 'success';
      window.setTimeout(() => (this.contactStatus = ''), 5000);
    } catch {
      this.showContactError('Failed to send. Please try again.');
    }
  }

  private showContactError(message: string): void {
    this.contactStatus = 'error';
    this.contactError = message;
    window.setTimeout(() => (this.contactStatus = ''), 3500);
  }
}
