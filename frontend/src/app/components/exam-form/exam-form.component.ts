import {Component, EventEmitter, inject, Input, OnChanges, Output} from '@angular/core';
import {ExamService} from '../../services/exam.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Exam} from '../../models/exam';
import {formatDateForInput, formatTimeForInput} from '../../helpers/helpers';

@Component({
  selector: 'app-exam-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './exam-form.component.html',
  styleUrl: './exam-form.component.scss'
})
export class ExamFormComponent implements OnChanges{
  @Input() isOpen = false;
  @Input() examToUpdate?: Exam | undefined;
  @Output() closeEvent = new EventEmitter<void>();

  examService = inject(ExamService);
  private fb = inject(FormBuilder);

  // stocke les erreur venant du backend
  backendErrors: Record<string, string> = {};

  // Form group
  examForm: FormGroup = this.fb.group({
    studentName: [this.examToUpdate ? this.examToUpdate?.studentName : '', Validators.required],
    location: [this.examToUpdate ? this.examToUpdate?.location : '', Validators.required],
    date: [this.examToUpdate ? this.examToUpdate?.date : '', Validators.required],
    time: [this.examToUpdate ? this.examToUpdate?.time : '', Validators.required],
    status: [this.examToUpdate ? this.examToUpdate?.status : '', Validators.required]
  });

  ngOnChanges(): void {
    if (this.examToUpdate) {
      this.examForm.patchValue({
        studentName: this.examToUpdate.studentName,
        location: this.examToUpdate.location,
        date: formatDateForInput(this.examToUpdate.date),
        time: formatTimeForInput(this.examToUpdate.timeFormatted),
        status: this.examToUpdate.status
      });
    } else {
      this.examForm.reset();
    }
  }

  get title(): string {
    return this.examToUpdate ? 'Modifier l\'examen' : 'Ajouter un examen';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.examForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onSubmit() {
    if (this.examForm.valid) {
      const examData = this.examForm.value;
      const request$ = this.examToUpdate && this.examToUpdate.id
        ? this.examService.updateExam(this.examToUpdate.id, examData)
        : this.examService.addExam(examData);

      request$.subscribe({
        next: () => {
          this.examForm.reset();
          this.backendErrors = {};
          this.closeModal();
        },
        error: (error) => {
          if (error.status === 422 && error.error.violations) {
            this.backendErrors = error.error.violations.reduce((acc: any, v: any) => {
              acc[v.propertyPath] = v.message;
              return acc;
            }, {});
          }
        }
      });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.examForm.controls).forEach(key => {
        this.examForm.get(key)?.markAsTouched();
      });
    }
  }

  closeModal() {
    this.examForm.reset();
    this.closeEvent.emit();
  }
}
