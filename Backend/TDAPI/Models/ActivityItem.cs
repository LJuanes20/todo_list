using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDAPI.Models
{
    [Table("Activity")]
    public class ActivityItem
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(200, ErrorMessage = "El nombre no puede exceder 200 caracteres.")]
        public string Name { get; set; } = string.Empty;

        [StringLength(2000, ErrorMessage = "La descripción no puede exceder 2000 caracteres.")]
        public string? Description { get; set; }

        public bool IsCompleted { get; set; }

        [Column("Created")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
