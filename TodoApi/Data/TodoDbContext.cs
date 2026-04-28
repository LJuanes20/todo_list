using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Data;

public class TodoDbContext : DbContext
{
    public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options) { }

    public DbSet<TodoItem> TodoItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TodoItem>().Property(t => t.Title).IsRequired().HasMaxLength(200);
        modelBuilder.Entity<TodoItem>().Property(t => t.Description).HasMaxLength(1000);
    }
}
