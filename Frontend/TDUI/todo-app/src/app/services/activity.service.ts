import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private apiUrl = `${environment.apiUrl}/activity`;

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.apiUrl);
  }

  create(activity: Partial<Activity>): Observable<Activity> {
    return this.http.post<Activity>(this.apiUrl, activity);
  }

  update(id: number, activity: Partial<Activity>): Observable<Activity> {
    return this.http.put<Activity>(`${this.apiUrl}/${id}`, activity);
  }

  setStatus(id: number, isCompleted: boolean): Observable<Activity> {
    return this.http.patch<Activity>(`${this.apiUrl}/${id}/status`, { isCompleted });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
