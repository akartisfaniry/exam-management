import { Routes } from '@angular/router';
import {ExamListComponent} from './components/exam-list/exam-list.component';
import {LoginComponent} from './components/login/login.component';
import {TailwindPracticeComponent} from './components/tailwind-practice/tailwind-practice.component';

export const routes: Routes = [
  { path: '', redirectTo: '/exams', pathMatch: 'full' },
  { path: 'exams', component: ExamListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'tailwind-practice', component: TailwindPracticeComponent }
];
