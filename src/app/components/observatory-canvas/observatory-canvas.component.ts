import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { ThreeSceneService } from '../../shared/three-scene.service';

@Component({
  selector: 'app-observatory-canvas',
  standalone: true,
  template: `<div #canvasContainer class="fixed inset-0 -z-50 w-full h-full pointer-events-none bg-[#02040a]"></div>`,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ObservatoryCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef<HTMLDivElement>;

  constructor(private threeService: ThreeSceneService) {}

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      this.threeService.init(this.canvasContainer.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.threeService.destroy();
  }
}
