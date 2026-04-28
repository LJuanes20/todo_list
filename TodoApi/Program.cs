using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();

// Configure DbContext – use SQLite for development, SQL Server for production.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    builder.Services.AddDbContext<TodoDbContext>(options =>
        options.UseSqlite("Data Source=todo.db"));
}
else
{
    builder.Services.AddDbContext<TodoDbContext>(options =>
        options.UseSqlServer(connectionString));
}

// Allow Angular dev server
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Ensure database is created and migrations are applied
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<TodoDbContext>();
    db.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors();

// --- Todo CRUD Endpoints ---

app.MapGet("/api/todos", async (TodoDbContext db) =>
    await db.TodoItems.OrderByDescending(t => t.CreatedAt).ToListAsync())
    .WithName("GetTodos");

app.MapGet("/api/todos/{id:int}", async (int id, TodoDbContext db) =>
    await db.TodoItems.FindAsync(id) is TodoItem item
        ? Results.Ok(item)
        : Results.NotFound())
    .WithName("GetTodoById");

app.MapPost("/api/todos", async (TodoItem item, TodoDbContext db) =>
{
    item.CreatedAt = DateTime.UtcNow;
    item.IsCompleted = false;
    db.TodoItems.Add(item);
    await db.SaveChangesAsync();
    return Results.Created($"/api/todos/{item.Id}", item);
})
.WithName("CreateTodo");

app.MapPut("/api/todos/{id:int}", async (int id, TodoItem input, TodoDbContext db) =>
{
    var item = await db.TodoItems.FindAsync(id);
    if (item is null) return Results.NotFound();

    item.Title = input.Title;
    item.Description = input.Description;
    if (!item.IsCompleted && input.IsCompleted)
        item.CompletedAt = DateTime.UtcNow;
    else if (item.IsCompleted && !input.IsCompleted)
        item.CompletedAt = null;
    item.IsCompleted = input.IsCompleted;

    await db.SaveChangesAsync();
    return Results.Ok(item);
})
.WithName("UpdateTodo");

app.MapDelete("/api/todos/{id:int}", async (int id, TodoDbContext db) =>
{
    var item = await db.TodoItems.FindAsync(id);
    if (item is null) return Results.NotFound();
    db.TodoItems.Remove(item);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithName("DeleteTodo");

app.Run();
