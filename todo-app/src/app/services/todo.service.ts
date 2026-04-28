import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TodoItem, CreateTodoItem, UpdateTodoItem } from '../models/todo-item';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly apiUrl = 'http://localhost:5000/api/todos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(this.apiUrl);
  }

  create(item: CreateTodoItem): Observable<TodoItem> {
    return this.http.post<TodoItem>(this.apiUrl, item);
  }

  update(id: number, item: UpdateTodoItem): Observable<TodoItem> {
    return this.http.put<TodoItem>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
