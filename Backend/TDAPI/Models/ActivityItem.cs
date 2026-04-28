using System.ComponentModel.DataAnnotations.Schema;

namespace TDAPI.Models
{
    [Table("Activity")]
    public class ActivityItem
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }

        [Column("Created")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
