using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TDAPI.Infraestructure;
using TDAPI.Models;

namespace TDAPI.Controllers
{
    public class SetStatusRequest
    {
        public bool IsCompleted { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class ActivityController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ActivityController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActivityItem>>> GetAll()
        {
            return await _context.ActivityItems
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ActivityItem>> GetById(int id)
        {
            var item = await _context.ActivityItems.FindAsync(id);

            if (item == null)
                return NotFound();

            return item;
        }

        [HttpPost]
        public async Task<ActionResult<ActivityItem>> Create(ActivityItem item)
        {
            _context.ActivityItems.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ActivityItem>> Update(int id, ActivityItem item)
        {
            if (id != item.Id)
                return BadRequest();

            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(item);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.ActivityItems.FindAsync(id);

            if (item == null)
                return NotFound();

            _context.ActivityItems.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPatch("{id}/status")]
        public async Task<ActionResult<ActivityItem>> SetStatus(int id, [FromBody] SetStatusRequest request)
        {
            var item = await _context.ActivityItems.FindAsync(id);
            if (item == null)
                return NotFound();

            item.IsCompleted = request.IsCompleted;
            await _context.SaveChangesAsync();
            return Ok(item);
        }
    }
}
