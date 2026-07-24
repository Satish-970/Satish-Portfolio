import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { scrollToSection } from '../../shared/section-navigation';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      overflow: hidden;
      background: transparent;
    }

    /* canvas bg */
    .hero__canvas { position: absolute; inset: 0; z-index: 0; }
    .hero__canvas canvas { width: 100%; height: 100%; display: block; }

    /* layout */
    .hero__inner {
      position: relative; z-index: 2;
      width: 100%; max-width: 1280px; margin: 0 auto;
      padding: clamp(5rem,10vh,7rem) clamp(1.5rem,4vw,3rem) clamp(4rem,8vh,6rem);
      padding-right: max(5rem, 4vw + 70px);
      display: grid;
      grid-template-columns: 1fr minmax(0, 0.5fr);
      gap: clamp(2rem,5vw,4rem);
      align-items: center;
    }

    .hero__content { min-width: 0; }

    /* "Hi, I'm" */
    .hero__hi {
      font-family: var(--font-body);
      font-size: clamp(1rem, 1.8vw, 1.25rem);
      font-weight: 400;
      color: var(--text-muted);
      margin-bottom: 0.2rem;
      opacity: 0; animation: fadeUp 0.6s ease 0.2s forwards;
    }

    /* name — gold, cycles languages */
    .hero__name {
      display: block;
      font-family: var(--font-display);
      font-size: clamp(3.5rem, 8vw, 6.5rem);
      font-weight: 900;
      line-height: 0.9;
      letter-spacing: -0.03em;
      color: var(--gold);
      opacity: 0; animation: fadeUp 0.6s ease 0.4s forwards;
      margin-bottom: 0.5rem;
    }
    .hero__name.cycling { animation: none; opacity: 1; transition: opacity 0.3s ease, transform 0.3s ease; }
    .hero__name.cycling.out { opacity: 0; transform: translateY(-14px); }

    /* last name */
    .hero__lastname {
      display: block;
      font-family: var(--font-display);
      font-size: clamp(1.8rem, 4vw, 3.5rem);
      font-weight: 700;
      line-height: 1.05;
      letter-spacing: -0.02em;
      color: var(--text);
      margin-bottom: 1.5rem;
      opacity: 0; animation: fadeUp 0.6s ease 0.6s forwards;
    }

    /* role tag */
    .hero__role {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: var(--font-stencil); font-size: 0.82rem;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: var(--gold); background: rgba(var(--gold-rgb),0.08);
      border: 1px solid var(--border); padding: 6px 14px;
      border-radius: 100px; margin-bottom: 1.25rem;
      opacity: 0; animation: fadeUp 0.6s ease 0.7s forwards;
    }
    .hero__role::before {
      content: ''; width: 6px; height: 6px; border-radius: 50%;
      background: var(--gold); box-shadow: 0 0 6px var(--gold);
    }

    /* desc */
    .hero__desc {
      font-size: clamp(0.9rem,1.4vw,1rem);
      color: var(--text-muted); line-height: 1.8;
      max-width: 460px; margin-bottom: 2rem;
      opacity: 0; animation: fadeUp 0.6s ease 0.85s forwards;
    }

    /* actions */
    .hero__actions {
      display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
      opacity: 0; animation: fadeUp 0.6s ease 1s forwards;
    }

    /* hud pills */
    .hero__hud {
      display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 1.5rem;
      opacity: 0; animation: fadeUp 0.6s ease 1.15s forwards;
    }
    .hero__hud button {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.42rem 0.85rem; border-radius: 999px;
      border: 1px solid var(--border); background: rgba(255,255,255,0.03);
      color: var(--text-muted); font-family: var(--font-mono); font-size: 0.7rem;
      transition: color 0.2s, border-color 0.2s, transform 0.2s;
    }
    .hero__hud button:hover { color: var(--gold); border-color: var(--border-bright); transform: translateY(-2px); }

    /* IMAGE — morphing blob, no border */
    .hero__image {
      display: flex; justify-content: center; align-items: center;
      opacity: 0; animation: fadeIn 1s ease 0.5s forwards;
      margin-left: -2rem;
    }
    .hero__img-blob {
      position: relative;
      width: clamp(260px, 32vw, 420px);
      height: clamp(260px, 32vw, 420px);
      flex-shrink: 0;
    }
    @keyframes blobMorph {
      0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
      25%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
      50%      { border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%; }
      75%      { border-radius: 60% 40% 60% 30% / 60% 30% 40% 70%; }
    }
    .hero__img-inner {
      position: absolute; inset: 0;
      border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
      overflow: hidden;
      animation: blobMorph 6s ease-in-out infinite;
    }
    .hero__img-inner img {
      width: 100%; height: 100%;
      object-fit: cover; object-position: center top;
      display: block; transition: transform 0.5s ease;
    }
    .hero__img-blob:hover .hero__img-inner img { transform: scale(1.05); }

    /* socials */
    .hero__socials {
      position: fixed; right: 1.75rem; top: 50%;
      transform: translateY(-50%);
      display: flex; flex-direction: column; gap: 0.85rem; z-index: 100;
    }
    .hero__socials a {
      width: 42px; height: 42px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(var(--gold-rgb),0.06); border: 1px solid var(--border);
      border-radius: 10px; font-size: 1.05rem; color: var(--text-muted);
      transition: all 0.25s ease;
    }
    .hero__socials a:hover {
      color: var(--gold); border-color: var(--border-bright);
      background: rgba(var(--gold-rgb),0.14); transform: translateX(-3px);
    }

    @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

    @media (max-width: 900px) {
      .hero__inner { grid-template-columns: 1fr; text-align: center; padding-top: clamp(4rem,8vh,6rem); }
      .hero__image { order: -1; }
      .hero__img-blob { width: clamp(200px,58vw,300px); height: clamp(200px,58vw,300px); }
      .hero__actions, .hero__hud { justify-content: center; }
      .hero__desc { margin-inline: auto; }
      .hero__role { margin-inline: auto; }
      .hero__socials { display: none; }
    }
    @media (max-width: 480px) {
      .hero__img-blob { width: clamp(170px,68vw,240px); height: clamp(170px,68vw,240px); }
      .hero__actions .btn, .hero__actions .btn-outline { width: 100%; justify-content: center; }
    }
  `],
  template: `
    <header class="hero" id="home">
      <div class="hero__canvas"><canvas #bgCanvas></canvas></div>

      <div class="hero__inner">
        <div class="hero__content">
          <p class="hero__hi">Hi, I'm</p>
          <span class="hero__name" [class.cycling]="hasCycled" [class.out]="nameOut">{{ displayName }}</span>
          <span class="hero__lastname">Pakalapati</span>
          <div class="hero__role">Data Analyst and Full Stack Developer</div>
          <p class="hero__desc">
            Satish, A dynamic Data Analyst and Developer — fiercely dedicated to unlocking insights through data and driving AI-powered breakthroughs. Fusing razor-sharp analytical prowess with cutting-edge development expertise.
          </p>
          <div class="hero__actions">
            <a href="mailto:satishpakalapati65@gmail.com" class="btn">
              <i class="ri-mail-send-line"></i>Hire Me Now
            </a>
            <a href="/Resume.pdf" class="btn-outline" target="_blank" rel="noopener noreferrer">
              <i class="ri-file-user-line"></i>Resume
            </a>
          </div>
        </div>

        <div class="hero__image">
          <div class="hero__img-blob">
            <div class="hero__img-inner">
              <img src="assets/images/IMG_6223.jpg" alt="Satish Pakalapati" />
            </div>
          </div>
        </div>
      </div>

      <div class="hero__socials">
        <a href="mailto:satishpakalapati65@gmail.com" title="Email"><i class="ri-mail-fill"></i></a>
        <a href="https://github.com/Satish-970" title="GitHub" target="_blank" rel="noopener noreferrer"><i class="ri-github-fill"></i></a>
        <a href="https://www.linkedin.com/in/satishpakalapati/" title="LinkedIn" target="_blank" rel="noopener noreferrer"><i class="ri-linkedin-fill"></i></a>
        <a href="https://satishportfolio.blogspot.com/" title="Blog" target="_blank" rel="noopener noreferrer"><i class="ri-article-fill"></i></a>
      </div>
    </header>
  `,
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('bgCanvas', { static: false }) bgCanvas?: ElementRef<HTMLCanvasElement>;

  constructor(private cdr: ChangeDetectorRef) {}

  private readonly langs = [
    { name: 'Satish'  },
    { name: 'సతీష్'  },
    { name: 'சதீஷ்'  },
    { name: 'ಸತೀಶ್'  },
    { name: 'സതീഷ്'  },
    { name: 'सतीश'   },
    { name: 'ਸਤੀਸ਼'  },
  ];

  displayName = this.langs[0].name;
  nameOut     = false;
  hasCycled   = false;

  private langIdx   = 0;
  private langTimer?: ReturnType<typeof setInterval>;
  private animFrame = 0;
  private cleanup?: () => void;

  ngAfterViewInit(): void {
    this.startLangCycle();
    this.initCanvas();
  }

  ngOnDestroy(): void {
    clearInterval(this.langTimer);
    cancelAnimationFrame(this.animFrame);
    this.cleanup?.();
  }

  goTo(e: Event, id: string): void { e.preventDefault(); scrollToSection(id); }
  nav(id: string): void { scrollToSection(id); }

  private startLangCycle(): void {
    setTimeout(() => {
      this.hasCycled = true;
      this.cdr.detectChanges();

      this.langTimer = setInterval(() => {
        this.nameOut = true;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.langIdx     = (this.langIdx + 1) % this.langs.length;
          this.displayName = this.langs[this.langIdx].name;
          this.nameOut     = false;
          this.cdr.detectChanges();
        }, 350);
      }, 2600);
    }, 1200);
  }

  private initCanvas(): void {
    const canvas = this.bgCanvas?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // ── Particles (connected constellation) ──
    interface P { x: number; y: number; vx: number; vy: number; r: number; color: string; }
    const colors = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8'];
    const COUNT  = 90;
    const pts: P[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.6,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    // ── Shooting stars ──
    interface S { x: number; y: number; vx: number; vy: number; life: number; max: number; }
    const shots: S[] = [];
    let tick = 0;

    let mx = 0.5, my = 0.5;
    const onMove = (e: MouseEvent) => { mx = e.clientX / window.innerWidth; my = e.clientY / window.innerHeight; };
    window.addEventListener('mousemove', onMove, { passive: true });

    const draw = () => {
      this.animFrame = requestAnimationFrame(draw);
      tick++;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const isDark = !document.body.getAttribute('data-theme') || document.body.getAttribute('data-theme') === 'dark';

      // nebula glows
      const glows: any[] = [];
      glows.forEach(g => {
        const gr = ctx.createRadialGradient(g.x*W, g.y*H, 0, g.x*W, g.y*H, g.r);
        gr.addColorStop(0, `rgba(${g.c},${g.a})`);
        gr.addColorStop(1, `rgba(${g.c},0)`);
        ctx.fillStyle = gr;
        ctx.beginPath(); ctx.arc(g.x*W, g.y*H, g.r, 0, Math.PI*2); ctx.fill();
      });

      // move + draw particles — strong mouse repulsion within radius
      const tx = mx * W, ty = my * H;
      pts.forEach(p => {
        const dx = p.x - tx, dy = p.y - ty;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
        if (dist < 150) {
          const push = (150 - dist) / 150 * 2.5;
          p.vx += (dx / dist) * push;
          p.vy += (dy / dist) * push;
        }
        p.vx *= 0.88; p.vy *= 0.88;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
      });

      // draw connections
      ctx.lineWidth = 0.4;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 130) {
            ctx.globalAlpha = (1 - dist / 130) * 0.12;
            ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;

      // shooting stars every ~5s
      if (tick % 300 === 0) {
        const ang = Math.PI / 5 + (Math.random() - 0.5) * 0.4;
        const spd = 10 + Math.random() * 6;
        shots.push({ x: Math.random()*W, y: Math.random()*H*0.4, vx: Math.cos(ang)*spd, vy: Math.sin(ang)*spd, life: 0, max: 50 + Math.random()*20 });
      }
      for (let i = shots.length - 1; i >= 0; i--) {
        const s = shots[i]; s.life++; s.x += s.vx; s.y += s.vy;
        const a = 1 - s.life / s.max;
        const g2 = ctx.createLinearGradient(s.x, s.y, s.x - s.vx*8, s.y - s.vy*8);
        g2.addColorStop(0, `rgba(255,255,255,${a})`);
        g2.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = g2; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx*8, s.y - s.vy*8); ctx.stroke();
        if (s.life >= s.max) shots.splice(i, 1);
      }
    };

    draw();
    this.cleanup = () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }
}
