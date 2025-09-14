import {Component, inject } from '@angular/core';
import {ExamService} from '../../services/exam.service';
import {CommonModule} from '@angular/common';
import {ExamFormComponent} from '../exam-form/exam-form.component';
import {Exam} from '../../models/exam';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [CommonModule, ExamFormComponent],
  templateUrl: './exam-list.component.html',
  styleUrl: './exam-list.component.scss'
})
export class ExamListComponent {
  examService = inject(ExamService);

  showModal = false;

  examSelected?: Exam | undefined;

  getBadgeClass(status: string): string {
    switch (status) {
      case 'Confirmé':
        return 'bg-green-200 text-green-700';
      case 'À organiser':
        return 'bg-orange-200 text-orange-700';
      case 'Annulé':
        return 'bg-red-200 text-red-700';
      case 'En recherche de place':
        return 'bg-gray-200 text-gray-700';
      default:
        return 'bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium';
    }
  }

  getIconClass(status: string): string {
    switch (status) {
      case 'Confirmé':
        return 'fa-solid fa-check';
      case 'À organiser':
        return 'fa-solid fa-paper-plane';
      case 'Annulé':
        return 'fa-solid fa-x';
      case 'En recherche de place':
        return 'fa-regular fa-hourglass-half';
      default:
        return 'bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium';
    }
  }

  isStatusInSearchPlace(exam: Exam): boolean {
    return exam.status === 'En recherche de place';
  }

  onExamClick(exam: Exam) {
    this.examSelected = exam;
    this.showModal = true;
  }

  onCloseModal() {
    this.showModal = false;
    this.examSelected = undefined;
  }
}
