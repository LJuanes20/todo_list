# todo_list

A full-stack **To Do List** application built with:

- **Backend**: ASP.NET 9 Web API + Entity Framework Core
- **Frontend**: Angular 20 (standalone components, signals)
- **Database**: SQL Server (production) / SQLite (development)

---

## Project Structure

```
todo_list/
├── TodoApi/        # ASP.NET 9 Web API
└── todo-app/       # Angular 20 SPA
```

---

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9)
- [Node.js 18+](https://nodejs.org/) with npm
- SQL Server (optional – SQLite is used by default in development)

---

## Backend (TodoApi)

### Run (development – uses SQLite automatically)

```bash
cd TodoApi
dotnet run
```

The API will be available at `http://localhost:5000`.

### Configure SQL Server (production)

Set the `DefaultConnection` connection string in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=TodoDb;Trusted_Connection=True;"
  }
}
```

### API Endpoints

| Method | URL                 | Description         |
|--------|---------------------|---------------------|
| GET    | `/api/todos`        | List all todos      |
| GET    | `/api/todos/{id}`   | Get a single todo   |
| POST   | `/api/todos`        | Create a todo       |
| PUT    | `/api/todos/{id}`   | Update a todo       |
| DELETE | `/api/todos/{id}`   | Delete a todo       |

---

## Frontend (todo-app)

### Install dependencies

```bash
cd todo-app
npm install
```

### Run development server

```bash
npx ng serve
```

Navigate to `http://localhost:4200`. The app automatically reloads when source files change.

### Build for production

```bash
npx ng build
```

Output is placed in `todo-app/dist/todo-app/`.

---

## Features

- ✅ Add tasks with an optional description
- ✅ Mark tasks as complete / incomplete
- ✅ Edit task title and description
- ✅ Delete tasks
- ✅ Live pending / done counters
