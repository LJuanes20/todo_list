import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Activity } from '../../models/activity.model';
import { ActivityService } from '../../services/activity.service';

@Component({
    selector: 'app-activity-delete-form',
    imports: [],
    templateUrl: './activity-delete-form.component.html',
    styleUrl: './activity-delete-form.component.css'
})
export class ActivityDeleteFormComponent implements OnChanges {
  @Input() activity: Partial<Activity> | null = null;

  @Output() saved = new EventEmitter<Activity>();
  @Output() cancelled = new EventEmitter<void>();
  model: Partial<Activity> | null = null;
  isSaving = false;
  errorMessage = '';

  constructor(private activityService: ActivityService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activity']) {
      this.model = this.activity ? { ...this.activity } : null;
      this.errorMessage = '';
    }
  }

  save(): void {
    this.isSaving = true;
    this.errorMessage = '';

    if (!this.model || !this.model.id) {
      this.isSaving = false;
      this.errorMessage = 'Tarea no válida.';
      return;
    }

    const request$ = this.activityService.delete(this.model!.id!);

    request$.subscribe({
      next: (result) => {
        this.isSaving = false;
        this.saved.emit(this.model as Activity);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = 'Error al eliminar la tarea.';
        console.error(err);
      }
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}