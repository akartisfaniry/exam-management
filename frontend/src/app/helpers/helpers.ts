import {WritableSignal} from '@angular/core';
import {throwError} from 'rxjs';

export function handleValidationError(
  error: any,
  errorSignal: WritableSignal<string | null>,
  submittingSignal?: WritableSignal<boolean>,
  errorMessage: string = 'Erreur inattendue',
) {
  if (error.status === 422 && error.error.violations) {
    const messages = error.error.violations.map((v: any) => `${v.propertyPath}: ${v.message}`);
    errorSignal.set(messages.join('\n'));
  } else {
    errorSignal.set(errorMessage);
  }

  if (submittingSignal) {
    submittingSignal.set(false);
  }

  return throwError(() => error);
}

export function formatDateForInput(dateStr?: string): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTimeForInput(timeStr?: string): string | null {
  if (!timeStr) return null;

  // Supprime les espaces et remplace le 'h' par ':'
  let t = timeStr.replace(/\s+/g, '').replace('h', ':');

  // Si on a juste "13:" → ajoute "00"
  if (t.endsWith(':')) t += '00';

  return t;
}
