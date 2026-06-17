
## ToDo List Angular + ASP .NET 9 + SQL SERVER
---

## Requisitos previos

Asegúrate de tener instalado lo siguiente antes de empezar:

- [.NET SDK 9.0+](https://dotnet.microsoft.com/download)
- [Node.js 20.x LTS o superior](https://nodejs.org/)
- [Angular CLI 20+](https://angular.dev/) → `npm install -g @angular/cli`
- [SQL Server 2019+](https://www.microsoft.com/sql-server/sql-server-downloads) (Express, Developer o LocalDB)
- [SSMS](https://learn.microsoft.com/sql/ssms/) o Azure Data Studio (opcional, para administrar la BD)
- Git

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/LJuanes20/todo_list.git
cd todo_list
```

### 2. Configurar la base de datos

Crea la base de datos `todolist` y la tabla `Activity` ejecutando el siguiente script en SSMS (también puedes guardarlo en `Scripts/01_create_database.sql`):

```sql
-- Crear base de datos
IF DB_ID('todolist') IS NULL
    CREATE DATABASE todolist;
GO

USE todolist;
GO

-- Crear tabla Activity
IF OBJECT_ID('dbo.Activity', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Activity (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        Name         NVARCHAR(200)  NOT NULL,
        Description  NVARCHAR(2000) NULL,
        IsCompleted  BIT            NOT NULL DEFAULT 0,
        Created      DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO
```

> La connection string por defecto en `appsettings.json` usa autenticación de Windows en `localhost`. Si tu instancia es distinta, ajústala (ver siguiente paso).

### 3. Configurar la connection string

Edita `Backend/TDAPI/appsettings.json` si tu instancia de SQL Server es distinta:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=todolist;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Ejemplos alternativos:

```jsonc
// SQL Server con autenticación SQL
"DefaultConnection": "Server=localhost;Database=todolist;User Id=sa;Password=TuPassword;TrustServerCertificate=True;"

// LocalDB
"DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=todolist;Trusted_Connection=True;"
```

---

## ▶ Ejecución

### Backend (TDAPI)

```bash
cd Backend/TDAPI
dotnet restore
dotnet run
```

La API queda disponible en:

- HTTP: `http://localhost:5057`
- HTTPS: `https://localhost:7053`
- Swagger UI: `https://localhost:7053/swagger`

### Frontend (todo-app)

En otra terminal:

```bash
cd Frontend/TDUI/todo-app
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200/`.

> El frontend lee la URL del backend desde `src/environments/environment.ts`. Si cambias el puerto del backend, ajústalo allí.

---

## Endpoints de la API

Base URL: `https://localhost:7053/api/Activity`

| Método   | Ruta                          | Descripción                                  | Body                    |
| -------- | ----------------------------- | -------------------------------------------- | ----------------------- |
| `GET`    | `/api/Activity`               | Lista todas las actividades (orden por fecha desc.) | —                |
| `GET`    | `/api/Activity/{id}`          | Obtiene una actividad por su Id              | —                       |
| `POST`   | `/api/Activity`               | Crea una nueva actividad                     | `ActivityItem`          |
| `PUT`    | `/api/Activity/{id}`          | Actualiza una actividad existente            | `ActivityItem`          |
| `PATCH`  | `/api/Activity/{id}/status`   | Cambia el estado completada/pendiente        | `{ "isCompleted": true }` |
| `DELETE` | `/api/Activity/{id}`          | Elimina una actividad                        | —                       |

### Ejemplo de payload `ActivityItem`

```json
{
  "id": 0,
  "name": "Comprar víveres",
  "description": "Leche, pan y huevos",
  "isCompleted": false,
  "createdAt": "2026-05-08T10:30:00Z"
}
```

### Ejemplo con `curl`

```bash
# Crear una actividad
curl -k -X POST https://localhost:7053/api/Activity \
  -H "Content-Type: application/json" \
  -d '{"name":"Aprender Angular 20","description":"Standalone components"}'

# Marcar como completada
curl -k -X PATCH https://localhost:7053/api/Activity/1/status \
  -H "Content-Type: application/json" \
  -d '{"isCompleted":true}'
```

---
### Frontend

```bash
cd Frontend/TDUI/todo-app
npm test
```
---

## Autor
**Luis Osvaldo Juanes Hinojosa**

- GitHub: [@LJuanes20](https://github.com/LJuanes20)
- LinkedIn: [in/ljuanes25](https://www.linkedin.com/in/ljuanes25/)
