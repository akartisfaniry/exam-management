import {computed, Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Exam, ExamStats} from '../models/exam';
import {catchError, of, tap, throwError} from 'rxjs';
import {HydraResponse} from '../models/hydra-response';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'http://localhost:8400/api/exams';

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
      this.loadExams();
  }

  // definir l'entete de la requete
  private getHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/ld+json',
    });
  }

  loadExams() {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.http.get<HydraResponse<Exam>>(this.apiUrl, {
      headers: this.getHttpHeaders()
    })
      .pipe(
        tap(res => {
          this.examsSignal.set(res.items);
          this.loadingSignal.set(false);
        }),
        catchError(error => {
          this.errorSignal.set('Erreur lors du chargement des examens');
          this.loadingSignal.set(false);
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  addExam(exam: Exam) {
    this.submittingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.post<Exam>(this.apiUrl, exam, {
      headers: this.getHttpHeaders()
    })
      .pipe(
        tap(newExam => {
          this.examsSignal.update(exams => [...exams, newExam]);
          this.submittingSignal.set(false);
        }),
        catchError(error => {
          if (error.status === 422 && error.error.violations) {
            // On récupère les messages de Symfony (champ : message)
            const messages = error.error.violations.map((v: any) => `${v.propertyPath}: ${v.message}`);
            this.errorSignal.set(messages.join('\n'));
          } else {
            this.errorSignal.set('Erreur inattendue lors de l’ajout de l’examen');
          }
          this.submittingSignal.set(false);
          return throwError(() => error);
        })
      );
  }

}
