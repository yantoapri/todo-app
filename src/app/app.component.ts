import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from './components/navbar/navbar';
import { TaskTable } from './components/task-table/task-table';
import { KanbanBoard } from './components/kanban-board/kanban-board';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Navbar, TaskTable, KanbanBoard],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  // Tab aktif saat ini - mengontrol view mana yang ditampilkan
  activeTab: 'table' | 'kanban' = 'table';

  // Judul halaman untuk aplikasi
  title = 'Todo/Kanban App';

  // Handle perubahan tab dari komponen navbar
  setTab(tab: 'table' | 'kanban') {
    this.activeTab = tab;
  }

  // Pindah ke view table
  showTable() {
    this.activeTab = 'table';
  }

  // Pindah ke view kanban board
  showKanban() {
    this.activeTab = 'kanban';
  }

  // Cek apakah view table sedang aktif
  isTableActive(): boolean {
    return this.activeTab === 'table';
  }

  // Cek apakah view kanban sedang aktif
  isKanbanActive(): boolean {
    return this.activeTab === 'kanban';
  }
}
