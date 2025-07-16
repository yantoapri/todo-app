import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-task-table',
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  templateUrl: './task-table.html',
  styleUrl: './task-table.css',
})
export class TaskTable implements OnInit {
  tasks: Task[] = [];
  currentPage = 1;
  pageSize = 5;

  // Hapus semua kode terkait modal dan form task
  selectedPerson: string = '';
  searchTerm: string = '';
  sortColumn: string = 'title';
  sortOrder: 'asc' | 'desc' = 'asc';
  filteredTasks: Task[] = [];

  // Hapus openModal, closeModal, handleSaveTask, showModal, newTask

  editingRowId: number | null = null;
  editingField: string | null = null;
  editingDevelopers: string[] = [];

  startEdit(rowId: number, field: string) {
    this.editingRowId = rowId;
    this.editingField = field;
    if (field === 'developer') {
      const task = this.tasks.find((t) => t.id === rowId);
      this.editingDevelopers =
        task && task.developer
          ? task.developer
              .split(',')
              .map((d) => d.trim())
              .filter(Boolean)
          : [];
    }
  }

  stopEdit() {
    this.editingRowId = null;
    this.editingField = null;
  }

  updateField<T extends keyof Task>(row: Task, field: T, value: Task[T]) {
    if (field === 'estimatedSP' || field === 'actualSP') {
      row[field] = (parseInt(value as any, 10) || 0) as Task[T];
    } else if (field === 'date') {
      row[field] = value;
    } else {
      row[field] = value;
    }
    this.stopEdit();
  }

  addNewTask() {
    const newId =
      this.tasks.length > 0
        ? Math.max(...this.tasks.map((t) => t.id || 0)) + 1
        : 1;
    const newTask: Task = {
      id: newId,
      title: '',
      developer: '',
      status: 'Ready to start',
      priority: 'Medium',
      type: 'Feature Enhancements',
      estimatedSP: 0,
      actualSP: 0,
      date: '',
    };
    this.editingDevelopers = [];
    this.tasks = [newTask, ...this.tasks];
    this.filteredTasks = [];
    this.currentPage = 1;
    setTimeout(() => {
      this.editingRowId = newTask.id;
      this.editingField = 'developer';
    }, 0);
  }

  onMultiSelectDeveloperListbox(task: Task) {
    task.developer = this.editingDevelopers.join(', ');
  }

  get allDevelopers(): string[] {
    const devs = this.tasks.flatMap((t) =>
      t.developer.split(',').map((d) => d.trim())
    );
    return Array.from(new Set(devs)).filter(Boolean);
  }

  handleSearch() {
    let data = [...this.tasks];
    // Search by task name
    if (this.searchTerm) {
      data = data.filter((t) =>
        t.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    // Filter by developer
    if (this.selectedPerson) {
      data = data.filter((t) =>
        t.developer
          .split(',')
          .map((d) => d.trim())
          .includes(this.selectedPerson)
      );
    }
    // Sort by selected column
    data = data.sort((a, b) => {
      let aVal = a[this.sortColumn as keyof Task];
      let bVal = b[this.sortColumn as keyof Task];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return this.sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        return this.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      } else {
        return 0;
      }
    });
    this.filteredTasks = data;
    this.currentPage = 1;
  }

  setSortColumn(col: string) {
    if (this.sortColumn === col) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = col;
      this.sortOrder = 'asc';
    }
    this.handleSearch();
  }

  get pagedTasks(): Task[] {
    const data = this.filteredTasks.length ? this.filteredTasks : this.tasks;
    const start = (this.currentPage - 1) * this.pageSize;
    return data.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    const data = this.filteredTasks.length ? this.filteredTasks : this.tasks;
    return Math.ceil(data.length / this.pageSize) || 1;
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  showPersonDropdown = false;
  togglePersonDropdown() {
    this.showPersonDropdown = !this.showPersonDropdown;
  }

  showSortDropdown = false;
  toggleSortDropdown() {
    this.showSortDropdown = !this.showSortDropdown;
  }

  developerMultiSelect: string[] = [];

  ngOnInit() {
    fetch('https://mocki.io/v1/61c56458-2b07-44e2-9ec9-c7df98ccbe9f')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          this.tasks = data.data.map((item: any, idx: number) => ({
            id: idx + 1,
            title: item.title,
            developer: item.developer,
            status: item.status,
            priority: item.priority,
            type: item.type,
            estimatedSP: item['Estimated SP'] ?? 0,
            actualSP: item['Actual SP'] ?? 0,
          }));
        }
      });
  }

  get sumEstimatedSP(): number {
    return this.tasks.reduce((sum, t) => sum + (t.estimatedSP || 0), 0);
  }

  get sumActualSP(): number {
    return this.tasks.reduce((sum, t) => sum + (t.actualSP || 0), 0);
  }
}
