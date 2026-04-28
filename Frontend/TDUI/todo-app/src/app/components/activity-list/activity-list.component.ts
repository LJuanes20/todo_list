import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity } from '../../models/activity.model';
import { ActivityService } from '../../services/activity.service';
import { ModalComponent } from '../common/modal/modal.component';
import { ActivityFormComponent } from '../activity-form/activity-form.component';
import { ActivityDeleteFormComponent } from '../activity-delete-form/activity-delete-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faCheck, faClock, faPlus, faArrowDown, faArrowUp, faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-activity-list',
    imports: [CommonModule, ModalComponent, ActivityFormComponent, ActivityDeleteFormComponent, FontAwesomeModule],
    templateUrl: './activity-list.component.html',
    styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {
  activities: Activity[] = [];
  isLoading = true;
  errorMessage = '';
  showCompleted = true;

  faDelete = faTrash;
  faCheck = faCheck;
  faPending = faClock;
  faPlus = faPlus;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faArrowRight = faArrowRight;

  modalMode: 'form' | 'delete' | null = null;
  selectedActivity: Activity | null = null;

  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {
    this.activityService.getAll().subscribe({
      next: (data) => {
        this.activities = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar las tareas.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  get getActivities(): Activity[] {
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