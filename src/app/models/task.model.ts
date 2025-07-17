// Model Task - merepresentasikan satu task dalam sistem Kanban/Todo kita
// Model ini mendefinisikan struktur dan tipe untuk data task di seluruh aplikasi

export interface Task {
  // Identifier unik untuk task
  id: number;

  // Informasi dasar task
  title: string; // Nama/deskripsi task
  developer: string; // Daftar developer yang ditugaskan (dipisahkan koma)

  // Status dan kategorisasi task
  status: TaskStatus; // Status workflow saat ini
  priority: TaskPriority; // Level kepentingan
  type: TaskType; // Jenis pekerjaan

  // Story points untuk estimasi agile
  estimatedSP: number; // Story points yang diestimasi
  actualSP: number; // Story points aktual (setelah selesai)

  // Metadata tambahan
  date: string | Date; // Tanggal jatuh tempo atau tanggal pembuatan
  avatarUrl?: string; // URL gambar avatar untuk developer (opsional)
}

// Status task yang tersedia - merepresentasikan tahapan workflow
export type TaskStatus =
  | 'Ready to start' // Task siap untuk diambil
  | 'In Progress' // Task sedang dikerjakan
  | 'Waiting for review' // Task selesai dan menunggu review
  | 'Pending Deploy' // Task disetujui dan menunggu deployment
  | 'Done' // Task sepenuhnya selesai dan di-deploy
  | 'Stuck'; // Task terblokir atau ditahan

// Level prioritas task - membantu dengan prioritisasi
export type TaskPriority =
  | 'Critical' // Prioritas tertinggi - masalah urgent
  | 'High' // Prioritas tinggi - fitur penting
  | 'Medium' // Prioritas normal - pekerjaan standar
  | 'Low' // Prioritas rendah - nice to have
  | 'Best Effort'; // Prioritas terendah - ketika ada waktu

// Jenis task - mengkategorikan sifat pekerjaan
export type TaskType =
  | 'Feature Enhancements' // Fitur baru atau peningkatan
  | 'Bug' // Perbaikan bug dan masalah
  | 'Other'; // Task lainnya

// Helper function untuk validasi data task
export function isValidTask(task: any): task is Task {
  return (
    typeof task.id === 'number' &&
    typeof task.title === 'string' &&
    typeof task.developer === 'string' &&
    typeof task.status === 'string' &&
    typeof task.priority === 'string' &&
    typeof task.type === 'string' &&
    typeof task.estimatedSP === 'number' &&
    typeof task.actualSP === 'number' &&
    (typeof task.date === 'string' || task.date instanceof Date)
  );
}

// Helper function untuk membuat task baru dengan nilai default
export function createDefaultTask(): Omit<Task, 'id'> {
  return {
    title: 'Task Baru',
    developer: '',
    status: 'Ready to start',
    priority: 'Medium',
    type: 'Feature Enhancements',
    estimatedSP: 0,
    actualSP: 0,
    date: new Date(),
    avatarUrl: '',
  };
}
