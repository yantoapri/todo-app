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
  // Array data utama - menyimpan semua task dari API
  tasks: Task[] = [];
  // State untuk filter dan pencarian
  searchTerm: string = '';
  selectedDeveloper: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // State UI untuk dropdown
  showPersonDropdown = false;
  showSortDropdown = false;

  constructor(private dialog: MatDialog) {}

  // Membuka modal untuk membuat task baru
  openNewTaskModal() {
    // Ambil daftar developer unik untuk dropdown modal
    const allDevelopers = Array.from(
      new Set(this.tasks.map((t) => t.developer))
    );

    const dialogRef = this.dialog.open(NewTaskModal, {
      width: '400px',
      data: { allDevelopers },
    });

    // Handle hasil ketika modal ditutup
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Generate ID baru (increment sederhana dari ID maksimal yang ada)
        const newId =
          this.tasks.length > 0
            ? Math.max(...this.tasks.map((t) => t.id)) + 1
            : 1;

        // Tambahkan task baru ke array kita
        this.tasks.push({
          id: newId,
          title: result.title,
          developer: Array.isArray(result.developer)
            ? result.developer.join(', ') // Konversi array ke string dengan koma
            : result.developer,
          status: result.status,
          priority: result.priority,
          type: result.type,
          estimatedSP: result.estimatedSP,
          actualSP: result.actualSP,
          date: result.date,
          avatarUrl: '', // TODO: Tambahkan fungsi upload avatar nanti
        });
      }
    });
  }

  ngOnInit() {
    // Ambil data task dari API mock kita
    fetch('https://mocki.io/v1/61c56458-2b07-44e2-9ec9-c7df98ccbe9f')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          // Transform data API agar sesuai dengan model Task kita
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
      })
      .catch((error) => {
        console.error('Gagal memuat tasks:', error);
        // TODO: Tambahkan error handling yang proper dengan notifikasi user
      });
  }

  // Getter untuk kolom Ready to start" - menerapkan filter dan sorting
  get readyToStart() {
    return this.sortTasks(
      this.tasks.filter(
        (t) => t.status === 'Ready to start' && this.filterBySearch(t)
      )
    );
  }

  // Getter untuk kolom "In Progress"
  get inProgress() {
    return this.sortTasks(
      this.tasks.filter(
        (t) => t.status === 'In Progress' && this.filterBySearch(t)
      )
    );
  }

  // Getter untuk kolom "Waiting for review"
  get waitingForReview() {
    return this.sortTasks(
      this.tasks.filter(
        (t) => t.status === 'Waiting for review' && this.filterBySearch(t)
      )
    );
  }

  // Getter untuk kolomDone"
  get done() {
    return this.sortTasks(
      this.tasks.filter((t) => t.status === 'Done' && this.filterBySearch(t))
    );
  }

  // Ekstrak nama developer unik dari string yang dipisahkan koma
  get uniqueDevelopers(): string[] {
    // Split string developer yang dipisahkan koma, flatten, trim whitespace, hapus string kosong, dan deduplikasi
    const devs = this.tasks
      .flatMap((t) => t.developer.split(','))
      .map((dev) => dev.trim())
      .filter((dev) => dev !== '');
    return Array.from(new Set(devs)).sort();
  }

  // Cek apakah task cocok dengan kriteria pencarian dan filter saat ini
  filterBySearch(task: Task): boolean {
    // Cek search term (case-insensitive)
    if (
      this.searchTerm &&
      !task.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Cek filter developer
    if (this.selectedDeveloper && this.selectedDeveloper !== '') {
      // Handle nama developer yang dipisahkan koma
      const taskDevelopers = task.developer.split(',').map((dev) => dev.trim());
      if (!taskDevelopers.includes(this.selectedDeveloper)) {
        return false;
      }
    }

    return true;
  }

  // Sort task berdasarkan judul dengan arah yang ditentukan
  sortTasks(tasks: Task[]): Task[] {
    const dir = this.sortDirection === 'asc' ? 1 : -1;
    return tasks.slice().sort((a, b) => a.title.localeCompare(b.title) * dir);
  }

  // Handle drag and drop antar kolom
  onTaskDrop(event: any, newStatus: Task['status']) {
    const prevList = event.previousContainer.data;
    const currList = event.container.data;
    const prevIndex = event.previousIndex;
    const currIndex = event.currentIndex;
    const task = prevList[prevIndex];

    // Update status task jika berubah
    if (task.status !== newStatus) {
      const mainTask = this.tasks.find((t) => t.id === task.id);
      if (mainTask) {
        mainTask.status = newStatus;
      }
    }

    // Handle reordering dalam kolom yang sama (untuk kelengkapan)
    if (event.previousContainer === event.container) {
      currList.splice(prevIndex, 1);
      currList.splice(currIndex, 0, task);
    }
  }

  // Toggle dropdown filter person
  togglePersonDropdown() {
    this.showPersonDropdown = !this.showPersonDropdown;
    // Tutup dropdown lain ketika membuka yang ini
    if (this.showPersonDropdown) {
      this.showSortDropdown = false;
    }
  }

  // Toggle dropdown sort
  toggleSortDropdown() {
    this.showSortDropdown = !this.showSortDropdown;
    // Tutup dropdown lain ketika membuka yang ini
    if (this.showSortDropdown) {
      this.showPersonDropdown = false;
    }
  }
}
