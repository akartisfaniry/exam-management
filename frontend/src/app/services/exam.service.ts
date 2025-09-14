import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Exam, ExamStats} from '../models/exam';
import {catchError, of, tap, throwError} from 'rxjs';
import {HydraResponse} from '../models/hydra-response';
import {AuthService} from './auth.service';
import {Environment} from '../../environments/environment.development';
import {handleValidationError} from '../helpers/helpers';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = Environment.apiUrl + '/exams';
  authService = inject(AuthService);

  // Signals
  private examsSignal = signal<Exam[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private submittingSignal = signal<boolean>(false);

  // declaration des signals publics
  exams = this.examsSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();
  submitting = this.submittingSignal.asReadonly();

  // calcul des stats
  stats = computed((): ExamStats => {
    const exams = this.examsSignal();
    return {
      confirmed: exams.filter(e => e.status === 'Confirmé').length,
      pending: exams.filter(e => e.status === 'À organiser').length,
      cancelled: exams.filter(e => e.status === 'Annulé').length,
      searching: exams.filter(e => e.status === 'En recherche de place').length,
      total: exams.length
    };
  });

  constructor(private http: HttpClient) {
    if (this.authService.isAuthenticated()) {
      this.loadExams();
    }
  }

  loadExams() {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.http.get<HydraResponse<Exam>>(this.apiUrl)
      .pipe(
        tap(res => {
          this.examsSignal.set(res.items);
          this.loadingSignal.set(false);
        }),
        catchError(error => {
          // Erreur client / parse JSON → on log seulement, pas d'affichage
          if (error.status !== 0) {
            this.errorSignal.set('Erreur lors du chargement des examens');
          }
          this.loadingSignal.set(false);
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  addExam(exam: Exam) {
    this.submittingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.post<Exam>(this.apiUrl, exam)
      .pipe(
        tap(newExam => {
          this.examsSignal.update(exams => [...exams, newExam]);
          this.submittingSignal.set(false);
        }),
        catchError(error =>
          handleValidationError(
            error,
            this.errorSignal,
            this.submittingSignal,
            'Erreur inattendue lors de l’ajout de l’examen'
          )
        )
      );
  }

  updateExam(id: number, exam: Exam) {
    this.submittingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.put<Exam>(`${this.apiUrl}/${id}`, exam)
      .pipe(
        tap(updatedExam => {
          // Remplace l'examen mis à jour dans la liste
          this.examsSignal.update(exams =>
            exams.map(e => e.id === updatedExam.id ? updatedExam : e)
          );
          this.submittingSignal.set(false);
        }),
        catchError(error =>
          handleValidationError(
            error,
            this.errorSignal,
            this.submittingSignal,
            'Erreur inattendue lors de la mise à jour de l’examen'
          )
        )
      );
  }

}
