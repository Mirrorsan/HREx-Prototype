import { Component, ChangeDetectionStrategy, signal, computed, inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeService, Employee } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';

export interface OrgNode extends Employee {
  children: OrgNode[];
}

@Component({
  selector: 'app-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  // FIX: Replaced @HostListener with the host property for better practice.
  host: {
    '(window:mousemove)': 'onPanMove($event)',
    '(window:mouseup)': 'onPanEnd()',
  },
})
export class OrgChartComponent implements AfterViewInit {
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  Math = Math;

  @ViewChild('chartContainer') chartContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('chartContent') chartContent!: ElementRef<HTMLDivElement>;
  
  // Interaction states
  zoomLevel = signal(1);
  panOffset = signal({ x: 0, y: 0 });
  isPanning = signal(false);
  private panStart = { x: 0, y: 0 };
  
  // Node states
  collapsedNodes = signal<Set<number>>(new Set());
  expandedNodeId = signal<number | null>(null);
  
  // Drag & Drop states
  draggedNode = signal<OrgNode | null>(null);
  dropTargetNode = signal<OrgNode | null>(null);
  canManageChart = computed(() => this.authService.hasPermission('people:org-chart:manage'));

  private allEmployees = this.employeeService.getEmployees();
  
  tree = computed(() => {
    const employees = this.allEmployees();
    // FIX: Explicitly type children as OrgNode[] to aid with type inference.
    const map = new Map(employees.map(e => [e.id, { ...e, children: [] as OrgNode[] }]));
    const roots: OrgNode[] = [];

    for (const employee of employees) {
      const node = map.get(employee.id)!;
      if (employee.managerId === null) {
        roots.push(node);
      } else {
        const manager = map.get(employee.managerId);
        // FIX: Added a check to ensure manager exists before pushing a child.
        if (manager) {
          manager.children.push(node);
        }
      }
    }
    return roots;
  });

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

    // Use getBoundingClientRect and divide by current zoom to get the unscaled size
    const contentRect = content.getBoundingClientRect();
    const currentZoom = this.zoomLevel();
    const contentWidth = contentRect.width / currentZoom;
    const contentHeight = contentRect.height / currentZoom;


    if (contentWidth === 0 || contentHeight === 0) return;

    // Add some padding to the view
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
    // Prevent panning when clicking on interactive elements
    if (target.closest('button, a, [draggable="true"]')) {
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
  
  toggleCollapse(nodeId: number): void {
    this.collapsedNodes.update(currentSet => {
      const newSet = new Set(currentSet);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }

  setExpandedNode(nodeId: number | null): void {
    this.expandedNodeId.set(nodeId);
  }
  
  // Drag and Drop Handlers
  handleDragStart(event: DragEvent, node: OrgNode): void {
    if (!this.canManageChart()) return;
    event.dataTransfer!.setData('text/plain', node.id.toString());
    event.dataTransfer!.effectAllowed = 'move';
    this.draggedNode.set(node);
  }

  handleDragOver(event: DragEvent, potentialTarget: OrgNode): void {
    if (!this.canManageChart() || !this.draggedNode()) return;
    
    // Prevent dropping on itself or its own children
    if (this.draggedNode()!.id === potentialTarget.id || this.isDescendant(this.draggedNode()!, potentialTarget.id)) {
        this.dropTargetNode.set(null);
        return;
    }
    
    event.preventDefault();
    this.dropTargetNode.set(potentialTarget);
  }
  
  private isDescendant(node: OrgNode, potentialChildId: number): boolean {
    if (node.id === potentialChildId) return true;
    for (const child of node.children) {
      if (this.isDescendant(child, potentialChildId)) return true;
    }
    return false;
  }

  handleDragLeave(): void {
    this.dropTargetNode.set(null);
  }

  handleDrop(event: DragEvent, newManager: OrgNode): void {
    if (!this.canManageChart() || !this.draggedNode() || !this.dropTargetNode()) return;
    event.preventDefault();
    const draggedNodeId = this.draggedNode()!.id;
    const newManagerId = newManager.id;
    
    if (draggedNodeId !== newManagerId) {
      this.employeeService.updateManager(draggedNodeId, newManagerId);
    }
    this.cleanupDragState();
  }

  handleDragEnd(): void {
    this.cleanupDragState();
  }
  
  private cleanupDragState(): void {
    this.draggedNode.set(null);
    this.dropTargetNode.set(null);
  }
}
