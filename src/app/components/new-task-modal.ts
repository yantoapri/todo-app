import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-task-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './new-task-modal.html',
  styleUrl: './new-task-modal.css',
})
export class NewTaskModal {
  title = '';
  developer: string[] = [];
  status = 'Ready to start';
  priority = 'Medium';
  type = 'Feature Enhancements';
  date: Date | null = null;
  estimatedSP = 0;
  actualSP = 0;
  allDevelopers: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<NewTaskModal>,
    @Inject(MAT_DIALOG_DATA) public data: { allDevelopers: string[] }
  ) {
    // Flatten, trim, deduplicate developer names
    this.allDevelopers = Array.from(new Set(
      (data.allDevelopers || [])
        .flatMap(dev => dev.split(','))
        .map(dev => dev.trim())
        .filter(dev => dev !== '')
    ));
  }

  onSubmit() {
    this.dialogRef.close({
      title: this.title,
      developer: this.developer.join(', '),
      status: this.status,
      priority: this.priority,
      type: this.type,
      date: this.date,
      estimatedSP: this.estimatedSP,
      actualSP: this.actualSP,
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
