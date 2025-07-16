import { Task } from '../models/task.model';

export const DUMMY_TASKS: Task[] = [
  {
    id: 1,
    title: 'New Task',
    developer: '',
    status: 'Waiting for review',
    priority: 'Medium',
    type: 'Feature Enhancements',
    estimatedSP: 0,
    actualSP: 0,
    avatarUrl: 'assets/user-avatar.png',
  },
  {
    id: 2,
    title: 'New Task',
    developer: '',
    status: 'In Progress',
    priority: 'Best Effort',
    type: 'Feature Enhancements',
    estimatedSP: 0,
    actualSP: 0,
    avatarUrl: 'assets/user-avatar.png',
  },
  {
    id: 3,
    title: 'New Task',
    developer: '',
    status: 'Ready to start',
    priority: 'High',
    type: 'Other',
    estimatedSP: 2,
    actualSP: 1.5,
    avatarUrl: 'assets/user-avatar.png',
  },
];
