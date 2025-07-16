export interface Task {
  id: number;
  title: string;
  developer: string;
  status:
    | 'Ready to start'
    | 'In Progress'
    | 'Waiting for review'
    | 'Pending Deploy'
    | 'Done'
    | 'Stuck';
  priority: 'Critical' | 'High' | 'Medium' | 'Low' | 'Best Effort';
  type: 'Feature Enhancements' | 'Other' | 'Bug';
  estimatedSP: number;
  actualSP: number;
  date?: string;
  avatarUrl?: string;
}
