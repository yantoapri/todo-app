import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskModal } from '../new-task-modal';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-kanban-board',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    DragDropModule,
  ],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css',
})
export class KanbanBoard implements OnInit {
  tasks: Task[] = [];
  searchTerm: string = '';
  selectedDeveloper: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  showPersonDropdown = false;
  showSortDropdown = false;

  togglePersonDropdown() {
    this.showPersonDropdown = !this.showPersonDropdown;
    if (this.showPersonDropdown) {
      this.showSortDropdown = false;
    }
  }

  toggleSortDropdown() {
    this.showSortDropdown = !this.showSortDropdown;
    if (this.showSortDropdown) {
      this.showPersonDropdown = false;
    }
  }
  constructor(private dialog: MatDialog) {}

  openNewTaskModal() {
    const allDevelopers = Array.from(
      new Set(this.tasks.map((t) => t.developer))
    );
    const dialogRef = this.dialog.open(NewTaskModal, {
      width: '400px',
      data: { allDevelopers },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Assign a new id (max id + 1)
        const newId =
          this.tasks.length > 0
            ? Math.max(...this.tasks.map((t) => t.id)) + 1
            : 1;
        this.tasks.push({
          id: newId,
          title: result.title,
          developer: Array.isArray(result.developer)
            ? result.developer.join(', ')
            : result.developer,
          status: result.status,
          priority: result.priority,
          type: result.type,
          estimatedSP: result.estimatedSP,
          actualSP: result.actualSP,
          date: result.date,
          avatarUrl: '', // Optionally set avatarUrl
        });
      }
    });
  }

  ngOnInit() {
    fetch('https://mocki.io/v1/61c56458-2b07-44e2-9ec9-c7df98ccbe9f')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          this.tasks = data.data.map((item: any, idx: number) => ({
            id: idx + 1,
            title: item.title,
            developer: item.developer,
            status: item.status as Task['status'],
            priority: item.priority as Task['priority'],
            type: item.type as Task['type'],
            estimatedSP: item['Estimated SP'] ?? 0,
            actualSP: item['Actual SP'] ?? 0,
            date: item.date ?? '',
            avatarUrl: item.avatarUrl ?? '',
          }));
        }
      });
  }

  get readyToStart() {
    return this.sortTasks(
      this.tasks.filter(
        (t) => t.status === 'Ready to start' && this.filterBySearch(t)
      )
    );
  }
  get inProgress() {
    return this.sortTasks(
      this.tasks.filter(
        (t) => t.status === 'In Progress' && this.filterBySearch(t)
      )
    );
  }
  get waitingForReview() {
    return this.sortTasks(
      this.tasks.filter(
        (t) => t.status === 'Waiting for review' && this.filterBySearch(t)
      )
    );
  }
  get done() {
    return this.sortTasks(
      this.tasks.filter((t) => t.status === 'Done' && this.filterBySearch(t))
    );
  }
  get uniqueDevelopers(): string[] {
    // Split comma-separated developer strings, flatten, trim, deduplicate, and sort
    const devs = this.tasks
      .flatMap((t) => t.developer.split(','))
      .map((dev) => dev.trim())
      .filter((dev) => dev !== '');
    return Array.from(new Set(devs)).sort();
  }
  filterBySearch(task: Task): boolean {
    if (
      this.searchTerm &&
      !task.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (this.selectedDeveloper && task.developer !== this.selectedDeveloper) {
      return false;
    }
    return true;
  }
  sortTasks(tasks: Task[]): Task[] {
    // Always sort by title
    const dir = this.sortDirection === 'asc' ? 1 : -1;
    return tasks.slice().sort((a, b) => a.title.localeCompare(b.title) * dir);
  }

  onTaskDrop(event: any, newStatus: Task['status']) {
    const prevList = event.previousContainer.data;
    const currList = event.container.data;
    const prevIndex = event.previousIndex;
    const currIndex = event.currentIndex;
    const task = prevList[prevIndex];
    if (task.status !== newStatus) {
      // Update status in the main tasks array
      const mainTask = this.tasks.find((t) => t.id === task.id);
      if (mainTask) {
        mainTask.status = newStatus;
      }
    }
    // Optionally, reorder within the column (not strictly needed for Kanban, but for completeness)
    if (event.previousContainer === event.container) {
      currList.splice(prevIndex, 1);
      currList.splice(currIndex, 0, task);
    }
  }
}
