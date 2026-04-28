import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from './services/todo.service';
import { TodoItem } from './models/todo-item';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  todos = signal<TodoItem[]>([]);
  newTitle = '';
  newDescription = '';
  editingId: number | null = null;
  editTitle = '';
  editDescription = '';
  errorMessage = '';
  loading = signal(false);

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading.set(true);
    this.todoService.getAll().subscribe({
      next: (items) => {
        this.todos.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage = 'Failed to load todos. Make sure the API is running.';
        this.loading.set(false);
      }
    });
  }

  addTodo(): void {
    if (!this.newTitle.trim()) return;
    const payload = {
      title: this.newTitle.trim(),
      description: this.newDescription.trim() || undefined
    };
    this.todoService.create(payload).subscribe({
      next: (item) => {
        this.todos.update(todos => [item, ...todos]);
        this.newTitle = '';
        this.newDescription = '';
        this.errorMessage = '';
      },
      error: () => { this.errorMessage = 'Failed to create todo.'; }
    });
  }

  toggleComplete(todo: TodoItem): void {
    this.todoService.update(todo.id, { title: todo.title, description: todo.description, isCompleted: !todo.isCompleted }).subscribe({
      next: (updated) => {
        this.todos.update(todos => todos.map(t => t.id === updated.id ? updated : t));
        this.errorMessage = '';
      },
      error: () => { this.errorMessage = 'Failed to update todo.'; }
    });
  }

  startEdit(todo: TodoItem): void {
    this.editingId = todo.id;
    this.editTitle = todo.title;
    this.editDescription = todo.description ?? '';
  }

  saveEdit(todo: TodoItem): void {
    if (!this.editTitle.trim()) return;
    this.todoService.update(todo.id, { title: this.editTitle.trim(), description: this.editDescription.trim() || undefined, isCompleted: todo.isCompleted }).subscribe({
      next: (updated) => {
        this.todos.update(todos => todos.map(t => t.id === updated.id ? updated : t));
        this.editingId = null;
        this.errorMessage = '';
      },
      error: () => { this.errorMessage = 'Failed to update todo.'; }
    });
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  deleteTodo(id: number): void {
    this.todoService.delete(id).subscribe({
      next: () => {
        this.todos.update(todos => todos.filter(t => t.id !== id));
        this.errorMessage = '';
      },
      error: () => { this.errorMessage = 'Failed to delete todo.'; }
    });
  }

  get pendingCount(): number {
    return this.todos().filter(t => !t.isCompleted).length;
  }

  get completedCount(): number {
    return this.todos().filter(t => t.isCompleted).length;
  }
}

