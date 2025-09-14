export interface Exam {
  id?: number;
  studentName: string;
  location?: string;
  date: string;
  time: string;
  timeFormatted: string;
  status: 'Confirmé' | 'À organiser' | 'Annulé' | 'En recherche de place';
}
export interface ExamStats {
  confirmed: number;
  pending: number;
  cancelled: number;
  searching: number;
  total: number;
}
