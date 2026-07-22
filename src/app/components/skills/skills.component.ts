import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioSynthService } from '../../shared/audio-synth.service';

interface SkillNode {
  id: string;
  label: string;
  cluster: 'analytics' | 'engineering' | 'development' | 'marketing';
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
}

interface Connection {
  from: string;
  to: string;
  active: boolean;
}

interface TravelingParticle {
  fromNode: SkillNode;
  toNode: SkillNode;
  progress: number;
  speed: number;
  color: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative w-[100vw] h-full flex flex-col justify-center items-center px-6 md:px-16 overflow-hidden bg-transparent select-none" id="service">
      <!-- Section Label HUD -->
      <div class="absolute top-12 left-12 flex items-center gap-3">
        <span class="w-2.5 h-2.5 bg-[#00f0ff] rounded-full animate-ping"></span>
        <span class="font-mono text-xs text-[#00f0ff] tracking-[0.3em] uppercase">O-04 // SKILLS UNIVERSE</span>
      </div>

      <div class="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center z-10 relative">
        <!-- Interactive Canvas Section -->
        <div class="lg:col-span-2 relative w-full h-[380px] md:h-[450px] border border-[rgba(0,240,255,0.15)] bg-[rgba(5,8,17,0.4)] backdrop-blur-md rounded-xl overflow-hidden shadow-2xl">
          <!-- Canvas Element -->
          <canvas #constellationCanvas class="w-full h-full block cursor-crosshair"></canvas>
          
          <!-- Holographic Cluster Label HUD overlay -->
          <div class="absolute top-4 left-4 flex gap-4 font-mono text-[9px] text-[#7a8099]">
            <div><span class="inline-block w-1.5 h-1.5 bg-[#00f0ff] rounded-full mr-1"></span>ANALYTICS</div>
            <div><span class="inline-block w-1.5 h-1.5 bg-[#9000ff] rounded-full mr-1"></span>ENGINEERING</div>
            <div><span class="inline-block w-1.5 h-1.5 bg-[#ff00ea] rounded-full mr-1"></span>DEV</div>
            <div><span class="inline-block w-1.5 h-1.5 bg-[#ffc800] rounded-full mr-1"></span>MARKETING</div>
          </div>
        </div>

        <!-- Sidebar Cluster Panel Details -->
        <div class="flex flex-col gap-6 text-left">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-[rgba(0,240,255,0.06)] border border-[rgba(0,240,255,0.15)] rounded-full text-[10px] font-mono tracking-widest text-[#00f0ff] uppercase w-fit mb-3">
              Constellation Map
            </div>
            <h2 class="text-3xl md:text-4xl font-black uppercase tracking-wider text-white">
              SKILLS <span class="bg-gradient-to-r from-[#00f0ff] to-[#9000ff] bg-clip-text text-transparent">CONSTELLATION</span>
            </h2>
            <p class="mt-4 text-xs md:text-sm font-mono text-[#7a8099] leading-relaxed">
              Procedurally mapped nodes connected through digital synapses. Hovering over nodes lights up adjacent skill paths, highlighting full stack versatility.
            </p>
          </div>

          <!-- Description Box of Active Node -->
          <div class="min-h-[120px] bg-[rgba(10,15,30,0.5)] border border-[rgba(0,240,255,0.15)] p-4 rounded-lg backdrop-blur-md">
            <div *ngIf="selectedNode; else defaultTip" class="font-mono transition-all duration-300">
              <span class="text-[10px] text-[#00f0ff] uppercase tracking-widest">Selected Skill Node</span>
              <h4 class="text-white text-base font-bold uppercase mt-1 mb-2">{{ selectedNode.label }}</h4>
              <p class="text-[11px] text-[#7a8099] uppercase tracking-wider">
                Cluster: <span class="text-white">{{ selectedNode.cluster }}</span> // Status: Optimized
              </p>
            </div>
            <ng-template #defaultTip>
              <div class="font-mono text-[#7a8099] text-xs flex flex-col justify-center items-center h-full text-center">
                <i class="ri-radar-line text-2xl text-[rgba(0,240,255,0.35)] animate-pulse mb-2"></i>
                <span>HOVER OVER SKILL NODES ON THE MAP TO ILLUMINATE PATHS AND DISCOVER CORRELATIONS</span>
              </div>
            </ng-template>
          </div>
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
export class SkillsComponent implements OnInit, OnDestroy {
  @ViewChild('constellationCanvas', { static: true }) canvasEl!: ElementRef<HTMLCanvasElement>;

  private audioService = inject(AudioSynthService);

  private ctx!: CanvasRenderingContext2D;
  private nodes: SkillNode[] = [];
  private connections: Connection[] = [];
  private particles: TravelingParticle[] = [];
  private animationFrameId?: number;
  private resizeListener?: () => void;

  selectedNode: SkillNode | null = null;
  private hoveredNode: SkillNode | null = null;

  // Track mouse coordinates inside canvas
  private mouse = { x: -1000, y: -1000 };

  ngOnInit(): void {
    this.initCanvas();
    this.createNodes();
    this.createConnections();
    this.animate();

    if (typeof window !== 'undefined') {
      this.resizeListener = this.onResize.bind(this);
      window.addEventListener('resize', this.resizeListener, { passive: true });
      
      const canvas = this.canvasEl.nativeElement;
      canvas.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: true });
      canvas.addEventListener('mouseleave', this.onMouseLeave.bind(this), { passive: true });
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (typeof window !== 'undefined' && this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private initCanvas(): void {
    const canvas = this.canvasEl.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.onResize();
  }

  private onResize(): void {
    const canvas = this.canvasEl.nativeElement;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Recalculate positions based on new sizes
    this.repositionNodes();
  }

  private createNodes(): void {
    const skillList = [
      // Analytics Cluster (blue)
      { id: 'python', label: 'Python', cluster: 'analytics' as const },
      { id: 'sql', label: 'SQL / MySQL', cluster: 'analytics' as const },
      { id: 'tableau', label: 'Tableau', cluster: 'analytics' as const },
      { id: 'ga', label: 'Google Analytics', cluster: 'analytics' as const },
      { id: 'r', label: 'R Language', cluster: 'analytics' as const },
      { id: 'jupyter', label: 'Jupyter Notebooks', cluster: 'analytics' as const },

      // Engineering / DevOps (purple)
      { id: 'docker', label: 'Docker', cluster: 'engineering' as const },
      { id: 'k8s', label: 'Kubernetes', cluster: 'engineering' as const },
      { id: 'git', label: 'Git / GitHub', cluster: 'engineering' as const },
      { id: 'hadoop', label: 'Hadoop / Hive', cluster: 'engineering' as const },
      { id: 'spark', label: 'Apache Spark', cluster: 'engineering' as const },
      { id: 'mongodb', label: 'MongoDB', cluster: 'engineering' as const },
      { id: 'postgresql', label: 'PostgreSQL', cluster: 'engineering' as const },

      // Web / Dev (pink)
      { id: 'java', label: 'Java', cluster: 'development' as const },
      { id: 'ts', label: 'TypeScript', cluster: 'development' as const },
      { id: 'angular', label: 'Angular', cluster: 'development' as const },
      { id: 'react', label: 'React.js', cluster: 'development' as const },
      { id: 'node', label: 'Node.js', cluster: 'development' as const },
      { id: 'spring', label: 'Spring Boot', cluster: 'development' as const },

      // Marketing (gold)
      { id: 'googleads', label: 'Google Ads', cluster: 'marketing' as const },
      { id: 'seo', label: 'SEO Campaigning', cluster: 'marketing' as const }
    ];

    this.nodes = skillList.map(skill => ({
      id: skill.id,
      label: skill.label,
      cluster: skill.cluster,
      x: 0,
      y: 0,
      baseX: 0,
      baseY: 0,
      vx: 0,
      vy: 0,
      radius: 6,
      pulsePhase: Math.random() * Math.PI * 2
    }));
  }

  private repositionNodes(): void {
    const canvas = this.canvasEl.nativeElement;
    const w = canvas.width;
    const h = canvas.height;

    // Define center coordinates of clusters
    const clusters = {
      analytics: { cx: w * 0.25, cy: h * 0.3 },
      engineering: { cx: w * 0.75, cy: h * 0.3 },
      development: { cx: w * 0.35, cy: h * 0.75 },
      marketing: { cx: w * 0.7, cy: h * 0.7 }
    };

    // Distribute nodes in a circle around cluster centers
    const counts = { analytics: 0, engineering: 0, development: 0, marketing: 0 };

    this.nodes.forEach(node => {
      const c = clusters[node.cluster];
      const index = counts[node.cluster]++;
      const radius = 65 + Math.random() * 15;
      const angle = (index * (Math.PI * 2)) / 6; // Spread

      node.baseX = c.cx + Math.cos(angle) * radius;
      node.baseY = c.cy + Math.sin(angle) * radius;
      node.x = node.baseX;
      node.y = node.baseY;
    });
  }

  private createConnections(): void {
    // Inter-cluster connections
    const connectList: [string, string][] = [
      // Analytics internal
      ['python', 'sql'], ['python', 'r'], ['sql', 'tableau'], ['tableau', 'ga'], ['python', 'jupyter'], ['r', 'jupyter'],
      // Engineering internal
      ['docker', 'k8s'], ['docker', 'git'], ['hadoop', 'spark'], ['hadoop', 'postgresql'], ['postgresql', 'mongodb'], ['spark', 'mongodb'],
      // Dev internal
      ['java', 'spring'], ['ts', 'angular'], ['ts', 'react'], ['angular', 'node'], ['react', 'node'], ['spring', 'node'],
      // Marketing internal
      ['googleads', 'seo'],
      // Bridges between clusters
      ['python', 'postgresql'], // Analytics -> Eng
      ['python', 'spark'],      // Analytics -> Eng
      ['node', 'mongodb'],      // Dev -> Eng
      ['angular', 'ts'],        // Dev -> TS
      ['ga', 'googleads']       // Analytics -> Marketing
    ];

    this.connections = connectList.map(([from, to]) => ({
      from,
      to,
      active: false
    }));
  }

  private onMouseMove(event: MouseEvent): void {
    const canvas = this.canvasEl.nativeElement;
    const rect = canvas.getBoundingClientRect();
    this.mouse.x = event.clientX - rect.left;
    this.mouse.y = event.clientY - rect.top;

    // Check if hovering a node
    let foundNode: SkillNode | null = null;
    const hoverThreshold = 18;

    for (const node of this.nodes) {
      const dx = node.x - this.mouse.x;
      const dy = node.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < hoverThreshold) {
        foundNode = node;
        break;
      }
    }

    if (foundNode !== this.hoveredNode) {
      this.hoveredNode = foundNode;
      this.selectedNode = foundNode;
      if (foundNode) {
        this.audioService.playHoverTick();
        this.illuminateCluster(foundNode);
        this.spawnTravelingParticle(foundNode);
      } else {
        this.resetConnections();
      }
    }
  }

  private onMouseLeave(): void {
    this.mouse = { x: -1000, y: -1000 };
    this.hoveredNode = null;
    this.selectedNode = null;
    this.resetConnections();
  }

  private illuminateCluster(activeNode: SkillNode): void {
    this.connections.forEach(conn => {
      if (conn.from === activeNode.id || conn.to === activeNode.id) {
        conn.active = true;
      } else {
        conn.active = false;
      }
    });
  }

  private resetConnections(): void {
    this.connections.forEach(conn => conn.active = false);
  }

  private spawnTravelingParticle(startNode: SkillNode): void {
    // Find all links connected to startNode
    const adjacentLinks = this.connections.filter(c => c.from === startNode.id || c.to === startNode.id);
    if (adjacentLinks.length === 0) return;

    // Spawn travel particles along the links
    const colors = {
      analytics: '#00f0ff',
      engineering: '#9000ff',
      development: '#ff00ea',
      marketing: '#ffc800'
    };

    adjacentLinks.forEach(link => {
      const targetId = link.from === startNode.id ? link.to : link.from;
      const endNode = this.nodes.find(n => n.id === targetId);

      if (endNode) {
        this.particles.push({
          fromNode: startNode,
          toNode: endNode,
          progress: 0,
          speed: 0.02 + Math.random() * 0.015,
          color: colors[startNode.cluster]
        });
      }
    });

    // Keep active particles array bounded
    if (this.particles.length > 30) {
      this.particles.splice(0, this.particles.length - 30);
    }
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    const canvas = this.canvasEl.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    const time = Date.now() * 0.001;

    // 1. Update and drift nodes slightly for organic floating feel
    this.nodes.forEach(node => {
      // Float drift offset calculation
      const driftX = Math.sin(time + node.pulsePhase) * 6;
      const driftY = Math.cos(time + node.pulsePhase) * 6;
      node.x = node.baseX + driftX;
      node.y = node.baseY + driftY;
    });

    // 2. Draw connections (lines)
    this.connections.forEach(conn => {
      const fromNode = this.nodes.find(n => n.id === conn.from)!;
      const toNode = this.nodes.find(n => n.id === conn.to)!;

      this.ctx.beginPath();
      this.ctx.moveTo(fromNode.x, fromNode.y);
      this.ctx.lineTo(toNode.x, toNode.y);

      if (conn.active) {
        this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
        this.ctx.lineWidth = 2.0;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#00f0ff';
      } else {
        this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
        this.ctx.lineWidth = 1.0;
        this.ctx.shadowBlur = 0;
      }
      this.ctx.stroke();
    });

    // Reset shadow blur
    this.ctx.shadowBlur = 0;

    // 3. Draw and update procedural traveling particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.progress += p.speed;

      if (p.progress >= 1) {
        this.particles.splice(i, 1);
        continue;
      }

      // Interpolate coordinates
      const x = p.fromNode.x + (p.toNode.x - p.fromNode.x) * p.progress;
      const y = p.fromNode.y + (p.toNode.y - p.fromNode.y) * p.progress;

      this.ctx.beginPath();
      this.ctx.arc(x, y, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
    }
    this.ctx.shadowBlur = 0;

    // 4. Draw Nodes
    const colors = {
      analytics: '#00f0ff',
      engineering: '#9000ff',
      development: '#ff00ea',
      marketing: '#ffc800'
    };

    this.nodes.forEach(node => {
      const isHovered = this.hoveredNode === node;
      const color = colors[node.cluster];

      // Draw glowing background if hovered
      if (isHovered) {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius * 2.2, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
        this.ctx.fill();
      }

      // Draw primary node circle
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, isHovered ? node.radius + 2 : node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = isHovered ? '#ffffff' : color;
      this.ctx.shadowBlur = isHovered ? 12 : 5;
      this.ctx.shadowColor = color;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Draw Label
      this.ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(232, 234, 240, 0.7)';
      this.ctx.font = isHovered ? 'bold 10px monospace' : '9px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(node.label, node.x, node.y - (isHovered ? 12 : 10));
    });
  };
}
