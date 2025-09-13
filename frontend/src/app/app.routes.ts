import { Routes } from '@angular/router';
import {ExamListComponent} from './components/exam-list/exam-list.component';
import {LoginComponent} from './components/login/login.component';
import {TailwindPracticeComponent} from './components/tailwind-practice/tailwind-practice.component';
import {authGuard} from './guard/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/exams', pathMatch: 'full' },
  { path: 'exams', component: ExamListComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'tailwind-practice', component: TailwindPracticeComponent }
];
