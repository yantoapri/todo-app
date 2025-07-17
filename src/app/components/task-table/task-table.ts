import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskModal } from '../new-task-modal';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-task-table',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './task-table.html',
  styleUrl: './task-table.css',
})
export class TaskTable implements OnInit {
  // Array data utama - menyimpan semua task dari API
  tasks: Task[] = [];
  // State untuk filter dan pencarian
  searchTerm: string = '';
  selectedPerson: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortColumn: string = 'title';

  // State UI untuk dropdown
  showPersonDropdown = false;
  showSortDropdown = false;

  // State untuk pagination
  currentPage = 1;
  itemsPerPage = 10; // State untuk inline editing
  editingRowId: number | null = null;
  editingField: string | null = null;
  editingDevelopers: string[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    // Load data awal dari API mock kita
    this.loadTasks();
  }

  // Ambil task dari API dan transform mereka
  loadTasks() {
    fetch('https://mocki.io/v1/61c56458-2b07-44e2-9ec9-c7df98ccbe9f')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          // Transform response API agar sesuai dengan model Task kita
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

  // Ambil nama developer unik untuk dropdown filter
  get allDevelopers(): string[] {
    // Ekstrak developer unik dari string yang dipisahkan koma
    const devs = this.tasks
      .flatMap((t) => t.developer.split(','))
      .map((dev) => dev.trim())
      .filter((dev) => dev !== '');
    return Array.from(new Set(devs)).sort();
  }

  // Ambil task yang sudah difilter dan diurutkan untuk halaman saat ini
  get pagedTasks(): Task[] {
    const filtered = this.tasks.filter((task) => this.matchesFilter(task));
    const sorted = this.sortTasks(filtered);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return sorted.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Hitung total halaman untuk pagination
  get totalPages(): number {
    const filteredCount = this.tasks.filter((task) =>
      this.matchesFilter(task)
    ).length;
    return Math.ceil(filteredCount / this.itemsPerPage);
  }

  // Hitung jumlah estimated story points
  get sumEstimatedSP(): number {
    return this.tasks.reduce((sum, task) => sum + (task.estimatedSP || 0), 0);
  }

  // Hitung jumlah actual story points
  get sumActualSP(): number {
    return this.tasks.reduce((sum, task) => sum + (task.actualSP || 0), 0);
  }

  // Cek apakah task cocok dengan kriteria pencarian dan filter saat ini
  matchesFilter(task: Task): boolean {
    // Cek search term (case-insensitive title search)
    if (
      this.searchTerm &&
      !task.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Cek filter developer
    if (this.selectedPerson) {
      const taskDevelopers = task.developer.split(',').map((dev) => dev.trim());
      if (!taskDevelopers.includes(this.selectedPerson)) {
        return false;
      }
    }

    return true;
  }

  // Sort task berdasarkan kolom dan arah yang ditentukan
  sortTasks(tasks: Task[]): Task[] {
    const dir = this.sortOrder === 'asc' ? 1 : -1;
    return tasks.slice().sort((a, b) => {
      let aVal: any = a[this.sortColumn as keyof Task];
      let bVal: any = b[this.sortColumn as keyof Task];

      // Handle perbandingan string
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * dir;
      }

      // Handle perbandingan number
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * dir;
      }

      // Handle perbandingan date
      if (aVal instanceof Date && bVal instanceof Date) {
        return (aVal.getTime() - bVal.getTime()) * dir;
      }

      return 0;
    });
  }

  // Handle perubahan input pencarian
  handleSearch() {
    this.currentPage = 1; // Reset ke halaman pertama ketika mencari
  }

  // Set kolom untuk diurutkan
  setSortColumn(column: string) {
    if (this.sortColumn === column) {
      // Toggle arah sort jika kolom sama
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Kolom baru, default ke ascending
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
  }

  // Set halaman saat ini untuk pagination
  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
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

  // Mulai inline editing untuk field tertentu
  startEdit(rowId: number, field: string) {
    this.editingRowId = rowId;
    this.editingField = field;

    // Inisialisasi nilai editing
    if (field === 'developer') {
      const task = this.tasks.find((t) => t.id === rowId);
      if (task) {
        this.editingDevelopers = task.developer.split(',').map((d) => d.trim());
      }
    }
  }

  // Stop inline editing
  stopEdit() {
    this.editingRowId = null;
    this.editingField = null;
    this.editingDevelopers = [];
  }

  // Handle perubahan multi-select developer
  onMultiSelectDeveloperListbox(task: Task) {
    task.developer = this.editingDevelopers.join(', ');
  }

  // Buka modal untuk menambah task baru
  addNewTask() {
    const allDevelopers = Array.from(
      new Set(this.tasks.map((t) => t.developer))
    );

    const dialogRef = this.dialog.open(NewTaskModal, {
      width: '40px',
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
}
