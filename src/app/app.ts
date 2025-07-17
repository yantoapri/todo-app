import { Component, signal } from '@angular/core';
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
export class App {
  protected readonly title = signal('todo-app');
  activeTab: 'table' | 'kanban' = 'table';

  setTab(tab: 'table' | 'kanban') {
    this.activeTab = tab;
  }
}
