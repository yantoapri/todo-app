import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-new-task-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  templateUrl: './new-task-modal.html',
  styleUrl: './new-task-modal.css',
})
export class NewTaskModal {
  // Data form untuk task baru
  newTask = {
    title: '',
    developer: [] as string[], // Multi-select untuk developer
    status: 'Ready to start' as const,
    priority: 'Medium' as const,
    type: 'Feature Enhancements' as const,
    estimatedSP: 0,
    actualSP: 0,
    date: new Date(), // Default ke hari ini
  };

  // Opsi yang tersedia untuk dropdown
  statusOptions = [
    'Ready to start',
    'In Progress',
    'Waiting for review',
    'Pending Deploy',
    'Done',
    'Stuck',
  ];

  priorityOptions = ['Critical', 'High', 'Medium', 'Low', 'Best Effort'];

  typeOptions = ['Feature Enhancements', 'Other', 'Bug'];

  // Developer yang tersedia dari parent component
  allDevelopers: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<NewTaskModal>,
    @Inject(MAT_DIALOG_DATA) public data: { allDevelopers: string[] }
  ) {
    // Inisialisasi developer yang tersedia dari parent component
    this.allDevelopers = data.allDevelopers || [];
  }

  // Handle submit form
  onSubmit() {
    // Validasi dasar - pastikan field yang diperlukan terisi
    if (!this.newTask.title.trim()) {
      alert('Silakan masukkan judul task');
      return;
    }

    if (this.newTask.developer.length === 0) {
      alert('Silakan pilih minimal satu developer');
      return;
    }

    // Validasi story points (harus non-negatif)
    if (this.newTask.estimatedSP < 0 || this.newTask.actualSP < 0) {
      alert('Story points harus non-negatif');
      return;
    }

    // Tutup dialog dan return data task baru
    this.dialogRef.close(this.newTask);
  }

  // Cancel form dan tutup dialog
  onCancel() {
    this.dialogRef.close();
  }

  // Handle perubahan selection developer
  onDeveloperChange(developers: string[]) {
    this.newTask.developer = developers;
  }

  // Reset form ke nilai default
  resetForm() {
    this.newTask = {
      title: '',
      developer: [],
      status: 'Ready to start',
      priority: 'Medium',
      type: 'Feature Enhancements',
      estimatedSP: 0,
      actualSP: 0,
      date: new Date(),
    };
  }
}
