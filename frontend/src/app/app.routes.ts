import { Routes } from '@angular/router';
import {ExamListComponent} from './components/exam-list/exam-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/exams', pathMatch: 'full' },
  { path: 'exams', component: ExamListComponent },
];
