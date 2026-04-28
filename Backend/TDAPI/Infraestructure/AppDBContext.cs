using Microsoft.EntityFrameworkCore;
using TDAPI.Models;
namespace TDAPI.Infraestructure
{
    

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<ActivityItem> ActivityItems => Set<ActivityItem>();
    }
}
