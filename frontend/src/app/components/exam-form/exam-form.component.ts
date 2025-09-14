import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {ExamService} from '../../services/exam.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-exam-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './exam-form.component.html',
  styleUrl: './exam-form.component.scss'
})
export class ExamFormComponent {
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();

  examService = inject(ExamService);
  private fb = inject(FormBuilder);

  // stocke les erreur venant du backend
  backendErrors: Record<string, string> = {};

  // Form group
  examForm: FormGroup = this.fb.group({
    studentName: ['', Validators.required],
    location: [''],
    date: ['', Validators.required],
    time: ['', Validators.required],
    status: ['', Validators.required]
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.examForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onSubmit() {
    if (this.examForm.valid) {
      const examData = this.examForm.value;

      this.examService.addExam(examData).subscribe({
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
