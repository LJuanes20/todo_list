import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Activity } from '../../models/activity.model';
import { ActivityService } from '../../services/activity.service';

@Component({
    selector: 'app-activity-form',
    imports: [FormsModule],
    templateUrl: './activity-form.component.html',
    styleUrls: ['./activity-form.component.css']
})
export class ActivityFormComponent implements OnChanges {
  @Input() activity: Partial<Activity> | null = null;

  @Output() saved = new EventEmitter<Activity>();
  @Output() cancelled = new EventEmitter<void>();

  model: Partial<Activity> = this.createEmpty();
  isSaving = false;
  errorMessage = '';

  constructor(private activityService: ActivityService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activity']) {
      if (this.activity) {
        this.model = {
          ...this.activity,
          createdAt: this.toInputDate(this.activity.createdAt)
        };
      } else {
        this.model = this.createEmpty();
      }
      this.errorMessage = '';
    }
  }

  get isEditMode(): boolean {
    return !!this.model.id && this.model.id > 0;
  }

  get canSave(): boolean {
    return !!this.model.name?.trim() && !this.isSaving;
  }

  save(): void {
    if (!this.canSave) return;

    const payload: Partial<Activity> = {
      ...this.model,
      name: this.model.name!.trim(),
      description: this.model.description?.trim() || ''
    };

    this.isSaving = true;
    this.errorMessage = '';

    const request$ = this.isEditMode
      ? this.activityService.update(this.model.id!, payload)
      : this.activityService.create(payload);

    request$.subscribe({
      next: (result) => {
        this.isSaving = false;
        this.saved.emit(result);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = this.buildErrorMessage(err);
        console.error('Error al guardar tarea:', err);
      }
    });
  }

  /**
   * Construye un mensaje de error legible para el usuario, incluyendo
   * el status HTTP y los detalles que devuelva el backend (validaciones, etc.).
   */
  private buildErrorMessage(err: any): string {
    const action = this.isEditMode ? 'actualizar' : 'crear';
    const status = err?.status ?? '?';

    // ASP.NET Core con [ApiController] devuelve un ProblemDetails con campo "errors"
    // cuando falla validación por DataAnnotations.
    const validationErrors = err?.error?.errors;
    if (validationErrors && typeof validationErrors === 'object') {
      const messages = Object.entries(validationErrors)
        .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
        .join(' | ');
      return `Error al ${action} la tarea (HTTP ${status}). ${messages}`;
    }

    // Otros errores: title del ProblemDetails, o mensaje genérico
    const detail = err?.error?.title || err?.error?.detail || err?.message || 'Sin detalles';
    return `Error al ${action} la tarea (HTTP ${status}). ${detail}`;
  }

  cancel(): void {
    this.cancelled.emit();
  }

  private createEmpty(): Partial<Activity> {
    return {
      name: '',
      description: '',
      createdAt: this.formatDateForInput(new Date()),
      isCompleted: false
    };
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Acepta tanto "2026-04-27" como "2026-04-27T00:00:00..." y
   * devuelve siempre "yyyy-MM-dd", que es lo que requiere <input type="date">.
   */
  private toInputDate(value: string | undefined): string {
    if (!value) return this.formatDateForInput(new Date());
    return value.substring(0, 10);
  }
}