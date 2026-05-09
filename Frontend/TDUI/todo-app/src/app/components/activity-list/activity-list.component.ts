import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Activity } from '../../models/activity.model';
import { ActivityService } from '../../services/activity.service';
import { ModalComponent } from '../common/modal/modal.component';
import { ActivityFormComponent } from '../activity-form/activity-form.component';
import { ActivityDeleteFormComponent } from '../activity-delete-form/activity-delete-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faCheck, faClock, faPlus, faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { LoadingComponent } from "../common/loading/loading.component";

@Component({
  selector: 'app-activity-list',
  imports: [DatePipe, ModalComponent, ActivityFormComponent, ActivityDeleteFormComponent, FontAwesomeModule, LoadingComponent],
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {
  activities: Activity[] = [];
  isLoading = true;
  errorMessage = '';
  existError = false;

  private readonly SHOW_COMPLETED_KEY = 'todo-app:showCompleted';
  showCompleted = this.readShowCompleted();

  faDelete = faTrash;
  faCheck = faCheck;
  faPending = faClock;
  faPlus = faPlus;
  faArrowDown = faArrowDown;
  faArrowRight = faArrowRight;

  modalMode: 'form' | 'delete' | null = null;
  selectedActivity: Activity | null = null;

  constructor(private activityService: ActivityService) { }

  ngOnInit(): void {
    this.activityService.getAll().subscribe({
      next: (data) => {
        this.activities = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar las tareas.';
        this.isLoading = false;
        this.existError = true;
        console.error(err);
      }
    });
  }

  get sortedActivities(): Activity[] {
    return [...this.activities].sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
  }

  get completedCount(): number {
    return this.activities.filter(a => a.isCompleted).length;
  }

  get modalTitle(): string {
    if (this.modalMode === 'delete') return 'Eliminar tarea';
    return this.selectedActivity ? 'Editar tarea' : 'Nueva tarea';
  }

  get isModalOpen(): boolean {
    return this.modalMode !== null;
  }

  toggleCompleted(): void {
    this.showCompleted = !this.showCompleted;
    this.persistShowCompleted();
  }

  private readShowCompleted(): boolean {
    try {
      const stored = localStorage.getItem(this.SHOW_COMPLETED_KEY);
      return stored === null ? true : JSON.parse(stored) === true;
    } catch {
      return true;
    }
  }

  private persistShowCompleted(): void {
    try {
      localStorage.setItem(this.SHOW_COMPLETED_KEY, JSON.stringify(this.showCompleted));
    } catch {
      // localStorage podría no estar disponible (ej. modo incógnito con restricciones)
    }
  }

  setStatus(activity: Activity, isCompleted: boolean): void {
    this.errorMessage = '';
    this.existError = false;

    this.activityService.setStatus(activity.id, isCompleted).subscribe({
      next: (updated) => {
        this.activities = this.activities.map(a => a.id === updated.id ? updated : a);
      },
      error: (err) => {
        this.errorMessage = `Error al actualizar el estado de la tarea. (HTTP ${err?.status ?? '?'} - ${err?.statusText || 'sin texto'})`;
        this.existError = true;
        console.error('setStatus error completo:', err);
      }
    });
  }

  openAddModal(): void {
    this.selectedActivity = null;
    this.modalMode = 'form';
  }

  openEditModal(activity: Activity): void {
    this.selectedActivity = activity;
    this.modalMode = 'form';
  }

  openDeleteModal(activity: Activity): void {
    this.selectedActivity = activity;
    this.modalMode = 'delete';
  }

  closeModal(): void {
    this.modalMode = null;
    this.selectedActivity = null;
  }

  dismissError(): void {
    this.errorMessage = '';
    this.existError = false;
  }

  onActivitySaved(saved: Activity): void {
    const index = this.activities.findIndex(a => a.id === saved.id);
    if (index >= 0) {
      this.activities = this.activities.map(a => a.id === saved.id ? saved : a);
    } else {
      this.activities = [...this.activities, saved];
    }
    this.closeModal();
  }

  onActivityDeleted(deleted: Activity): void {
    this.activities = this.activities.filter(a => a.id !== deleted.id);
    this.closeModal();
  }
}