import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

export interface OrgNode {
  id: string;
  name: string;
  role: string;
  avatar: string;
  avatarColor: string;
  children?: OrgNode[];
  employees?: number;
}

@Component({
  selector: 'app-org-chart',
  templateUrl: './org-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:mousemove)': 'onPanMove($event)',
    '(window:mouseup)': 'onPanEnd()',
  },
})
export class OrgChartComponent {
  protected readonly Math = Math;

  treeData = signal<OrgNode>({
    id: 'director-1',
    name: 'Thomas Edison',
    role: 'Marketing Director',
    avatar: 'https://i.pravatar.cc/150?u=edison',
    avatarColor: 'bg-green-200',
    children: [
      {
        id: 'manager-1',
        name: 'Marie Curie',
        role: 'Manager',
        avatar: 'https://i.pravatar.cc/150?u=curie',
        avatarColor: 'bg-blue-200',
        children: [
          { id: 'sub-1', name: 'Will Thomson', role: 'Manager', avatar: 'https://i.pravatar.cc/150?u=thomson', avatarColor: 'bg-slate-200', employees: 3 },
          { id: 'sub-2', name: 'Carl Gauss', role: 'Manager', avatar: 'https://i.pravatar.cc/150?u=gauss', avatarColor: 'bg-slate-200', employees: 3 },
        ],
      },
      {
        id: 'manager-2',
        name: 'Blaise Pascal',
        role: 'Manager',
        avatar: 'https://i.pravatar.cc/150?u=pascal',
        avatarColor: 'bg-blue-200',
        children: [
          { id: 'sub-3', name: 'James Watt', role: 'Manager', avatar: 'https://i.pravatar.cc/150?u=watt', avatarColor: 'bg-slate-200', employees: 2 },
        ],
      },
      {
        id: 'manager-3',
        name: 'Isaac Newton',
        role: 'Manager',
        avatar: 'https://i.pravatar.cc/150?u=newton',
        avatarColor: 'bg-blue-200',
        children: [
          { id: 'sub-4', name: 'Maxwell Clerk', role: 'Manager', avatar: 'https://i.pravatar.cc/150?u=clerk', avatarColor: 'bg-slate-200', employees: 3 },
          { id: 'sub-5', name: 'Paul Dirac', role: 'Manager', avatar: 'https://i.pravatar.cc/150?u=dirac', avatarColor: 'bg-slate-200', employees: 2 },
        ],
      },
    ],
  });

  // Drag & Drop State
  draggedNodeInfo = signal<{ node: OrgNode; parent: OrgNode } | null>(null);
  dropTargetId = signal<string | null>(null);

  // Zoom & Pan State
  zoomLevel = signal(1); // 1 = 100%
  isPanning = signal(false);
  panOffset = signal({ x: 0, y: 0 });
  panStart = signal({ x: 0, y: 0 });


  // --- Drag & Drop Handlers ---
  handleDragStart(node: OrgNode, parent: OrgNode, event: DragEvent): void {
    event.dataTransfer?.setData('text/plain', node.id);
    this.draggedNodeInfo.set({ node, parent });
  }

  handleDragOver(event: DragEvent, parentNode: OrgNode): void {
    event.preventDefault();
    const dragged = this.draggedNodeInfo()?.node;
    if (dragged && this.canDrop(dragged, parentNode)) {
      this.dropTargetId.set(parentNode.id);
    }
  }

  handleDragLeave(): void {
    this.dropTargetId.set(null);
  }

  handleDrop(event: DragEvent, newParentNode: OrgNode): void {
    event.preventDefault();
    const info = this.draggedNodeInfo();
    if (!info || !this.canDrop(info.node, newParentNode)) {
      this.handleDragEnd();
      return;
    }

    const { node: draggedNode, parent: originalParentNode } = info;

    this.treeData.update(currentTree => {
      const newTree = JSON.parse(JSON.stringify(currentTree));
      const findNode = (root: OrgNode, nodeId: string): OrgNode | null => {
        if (root.id === nodeId) return root;
        for (const child of root.children || []) {
          const found = findNode(child, nodeId);
          if (found) return found;
        }
        return null;
      };
      const originalParentInTree = findNode(newTree, originalParentNode.id);
      const newParentInTree = findNode(newTree, newParentNode.id);
      if (originalParentInTree?.children && newParentInTree) {
        const nodeIndex = originalParentInTree.children.findIndex(c => c.id === draggedNode.id);
        if (nodeIndex > -1) {
          const [nodeToMove] = originalParentInTree.children.splice(nodeIndex, 1);
          if (!newParentInTree.children) newParentInTree.children = [];
          newParentInTree.children.push(nodeToMove);
        }
      }
      return newTree;
    });

    this.handleDragEnd();
  }

  handleDragEnd(): void {
    this.draggedNodeInfo.set(null);
    this.dropTargetId.set(null);
  }

  private canDrop(draggedNode: OrgNode, dropTarget: OrgNode): boolean {
    if (draggedNode.id === dropTarget.id) return false;
    const isDescendant = (parent: OrgNode, nodeId: string): boolean => {
      return parent.children?.some(child => child.id === nodeId || isDescendant(child, nodeId)) ?? false;
    };
    if (isDescendant(draggedNode, dropTarget.id)) return false;
    const isDraggedSubManager = !draggedNode.children?.length;
    const isTargetLevel2Manager = this.treeData().children?.some(c => c.id === dropTarget.id);
    return isDraggedSubManager && !!isTargetLevel2Manager;
  }

  // --- Zoom Handlers ---
  zoomIn(): void {
    this.zoomLevel.update(level => Math.min(level + 0.1, 1.5));
  }

  zoomOut(): void {
    this.zoomLevel.update(level => Math.max(level - 0.1, 0.5));
  }
  
  // --- Pan Handlers ---
  onPanStart(event: MouseEvent): void {
    // Do not start panning if the user is interacting with a button or a draggable element
    const target = event.target as HTMLElement;
    if (target.closest('button') || target.closest('[draggable="true"]')) {
      return;
    }
    event.preventDefault();
    this.isPanning.set(true);
    this.panStart.set({
      x: event.clientX - this.panOffset().x,
      y: event.clientY - this.panOffset().y,
    });
  }

  onPanMove(event: MouseEvent): void {
    if (!this.isPanning()) {
      return;
    }
    this.panOffset.set({
      x: event.clientX - this.panStart().x,
      y: event.clientY - this.panStart().y,
    });
  }

  onPanEnd(): void {
    this.isPanning.set(false);
  }
}