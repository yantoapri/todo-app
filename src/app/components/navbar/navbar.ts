import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Input() activeTab: 'table' | 'kanban' = 'table';
  @Output() tabChange = new EventEmitter<'table' | 'kanban'>();

  setTab(tab: 'table' | 'kanban') {
    this.tabChange.emit(tab);
  }
}
