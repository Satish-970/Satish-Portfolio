import { Injectable, signal } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class ThreeSceneService {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private particles!: THREE.Points;
  private grid!: THREE.GridHelper;
  private container!: HTMLElement;
  private animationFrameId?: number;

  // Track mouse coordinates for subtle perspective influence
  private mouse = { x: 0, y: 0 };
  private targetMouse = { x: 0, y: 0 };

  // Signals for communication
  public currentScroll = signal<number>(0); // Normalized scroll [0..1]
  public isInitialized = signal<boolean>(false);

  // Predefined Room Coordinates for Camera Positions
  private readonly roomPositions = [
    { pos: new THREE.Vector3(0, 0, 25), lookAt: new THREE.Vector3(0, 0, 0) },     // Room 1: Landing
    { pos: new THREE.Vector3(-15, 8, 12), lookAt: new THREE.Vector3(-5, 0, 0) },  // Room 2: About (orbiting)
    { pos: new THREE.Vector3(18, -6, 5), lookAt: new THREE.Vector3(5, -2, -5) },  // Room 3: Projects Observatory
    { pos: new THREE.Vector3(0, -18, -8), lookAt: new THREE.Vector3(0, -10, -5) }, // Room 4: Skills Universe
    { pos: new THREE.Vector3(-12, -2, -18), lookAt: new THREE.Vector3(0, 0, -12) },// Room 5: Certifications
    { pos: new THREE.Vector3(0, 5, -30), lookAt: new THREE.Vector3(0, 0, -25) }    // Room 6: Contact Console
  ];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: true });
    }
  }

  public init(container: HTMLElement): void {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x02040a, 0.025);

    // Setup Camera
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.copy(this.roomPositions[0].pos);

    // Setup Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Build Environment
    this.createLights();
    this.createParticles();
    this.createGrid();

    // Start Rendering Loop
    this.isInitialized.set(true);
    this.animate();

    window.addEventListener('resize', this.onResize.bind(this), { passive: true });
  }

  private createLights(): void {
    const ambientLight = new THREE.AmbientLight(0x0a1530, 1.5);
    this.scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f0ff, 3, 100);
    pointLight1.position.set(10, 10, 10);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x9000ff, 2, 80);
    pointLight2.position.set(-15, -10, -5);
    this.scene.add(pointLight2);
  }

  private createParticles(): void {
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x00f0ff); // Cyan
    const color2 = new THREE.Color(0x7000ff); // Deep Purple
    const colorTemp = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      // Create a cylindrical/spherical star field
      const theta = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 45;
      const y = (Math.random() - 0.5) * 50;

      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius;

      // Color interpolation based on position
      const mixRatio = (y + 25) / 50;
      colorTemp.copy(color1).lerp(color2, mixRatio);

      colors[i * 3] = colorTemp.r;
      colors[i * 3 + 1] = colorTemp.g;
      colors[i * 3 + 2] = colorTemp.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Texture creation (glowing circular point)
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(0, 240, 255, 0.8)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.35,
      map: texture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private createGrid(): void {
    // Glowing horizontal grid helper representing Bloomberg dashboard feel
    this.grid = new THREE.GridHelper(100, 50, 0x00f0ff, 0x112244);
    this.grid.position.y = -8;
    // Cast to any to disable standard material depth test for background glow styling
    (this.grid.material as THREE.Material).transparent = true;
    (this.grid.material as THREE.Material).opacity = 0.25;
    this.scene.add(this.grid);
  }

  private onMouseMove(event: MouseEvent): void {
    // Normalize mouse coords (-1 to +1)
    this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  private onResize(): void {
    if (!this.container || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    // Smooth lerp for mouse movement (inertia)
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

    // Slowly rotate particle field
    if (this.particles) {
      this.particles.rotation.y += 0.0008;
      this.particles.rotation.x += 0.0002;
    }

    // Intersect scroll value to camera pathways
    this.updateCameraPath();

    this.renderer.render(this.scene, this.camera);
  };

  private updateCameraPath(): void {
    if (!this.camera) return;

    const t = this.currentScroll(); // Normalized [0..1]
    const segmentCount = this.roomPositions.length - 1;
    const rawVal = t * segmentCount;
    const index = Math.floor(rawVal);
    const fraction = rawVal - index;

    let targetPos = new THREE.Vector3();
    let targetLook = new THREE.Vector3();

    if (index >= segmentCount) {
      targetPos.copy(this.roomPositions[segmentCount].pos);
      targetLook.copy(this.roomPositions[segmentCount].lookAt);
    } else {
      const pA = this.roomPositions[index];
      const pB = this.roomPositions[index + 1];

      // Linear interpolate position & lookAt
      targetPos.copy(pA.pos).lerp(pB.pos, fraction);
      targetLook.copy(pA.lookAt).lerp(pB.lookAt, fraction);
    }

    // Apply mouse influence (perspective parallax)
    const parallaxX = this.mouse.x * 2.2;
    const parallaxY = this.mouse.y * 1.5;
    this.camera.position.x += (targetPos.x + parallaxX - this.camera.position.x) * 0.08;
    this.camera.position.y += (targetPos.y + parallaxY - this.camera.position.y) * 0.08;
    this.camera.position.z += (targetPos.z - this.camera.position.z) * 0.08;

    // Apply smooth lookAt target
    const currentLook = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion).add(this.camera.position);
    currentLook.lerp(targetLook, 0.1);
    this.camera.lookAt(currentLook);
  }

  public destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize);
    }
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }
  }
}
