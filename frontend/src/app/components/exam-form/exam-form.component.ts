import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-exam-form',
  standalone: true,
  imports: [],
  templateUrl: './exam-form.component.html',
  styleUrl: './exam-form.component.scss'
})
export class ExamFormComponent {
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();

  closeModal() {
    this.closeEvent.emit();
  }
}
