import { Component, ChangeDetectionStrategy, signal, inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentService, DepartmentNode } from '../../services/department.service';

@Component({
  selector: 'app-department-org-chart',
  templateUrl: './department-org-chart.component.html',
  styleUrls: ['./department-org-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  host: {
    '(window:mousemove)': 'onPanMove($event)',
    '(window:mouseup)': 'onPanEnd()',
  },
})
export class DepartmentOrgChartComponent implements AfterViewInit {
  private departmentService = inject(DepartmentService);
  Math = Math;

  @ViewChild('chartContainer') chartContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('chartContent') chartContent!: ElementRef<HTMLDivElement>;
  
  // Interaction states
  zoomLevel = signal(1);
  panOffset = signal({ x: 0, y: 0 });
  isPanning = signal(false);
  private panStart = { x: 0, y: 0 };
  
  tree = this.departmentService.departmentTree;

  ngAfterViewInit(): void {
    // Use setTimeout to allow the view to be fully rendered before measuring
    setTimeout(() => this.fitAndCenter(), 0);
  }

  fitAndCenter(): void {
    if (!this.chartContainer?.nativeElement || !this.chartContent?.nativeElement) {
      return;
    }
    const container = this.chartContainer.nativeElement;
    const content = this.chartContent.nativeElement;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const contentRect = content.getBoundingClientRect();
    const currentZoom = this.zoomLevel();
    const contentWidth = contentRect.width / currentZoom;
    const contentHeight = contentRect.height / currentZoom;

    if (contentWidth === 0 || contentHeight === 0) return;

    const padding = 0.9;
    const scaleX = containerWidth / contentWidth;
    const scaleY = containerHeight / contentHeight;
    const newZoom = Math.min(scaleX, scaleY) * padding;

    this.zoomLevel.set(newZoom);
    this.panOffset.set({ x: 0, y: 0 });
  }

  zoomIn(): void {
    this.zoomLevel.update(level => Math.min(level + 0.1, 1.5));
  }

  zoomOut(): void {
    this.zoomLevel.update(level => Math.max(level - 0.1, 0.5));
  }
  
  centerView(): void {
      this.fitAndCenter();
  }

  onPanStart(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('button, a')) {
      return;
    }
    event.preventDefault();
    this.isPanning.set(true);
    this.panStart.x = event.clientX - this.panOffset().x;
    this.panStart.y = event.clientY - this.panOffset().y;
  }

  onPanMove(event: MouseEvent): void {
    if (!this.isPanning()) return;
    this.panOffset.set({
      x: event.clientX - this.panStart.x,
      y: event.clientY - this.panStart.y,
    });
  }

  onPanEnd(): void {
    this.isPanning.set(false);
  }
}
