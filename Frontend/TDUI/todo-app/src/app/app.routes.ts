import { Routes } from '@angular/router';
import { ActivityListComponent } from './components/activity-list/activity-list.component';

export const routes: Routes = [
  { path: '', component: ActivityListComponent },
  { path: '**', redirectTo: '' }
];
