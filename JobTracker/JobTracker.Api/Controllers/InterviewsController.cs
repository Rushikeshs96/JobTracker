using JobTracker.Domain.Entities;
using JobTracker.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InterviewsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<InterviewsController> _logger;
        public InterviewsController(AppDbContext appDbContext, ILogger<InterviewsController> logger)
        {
            _context = appDbContext;
            _logger = logger;
        }

        //GET /api/interviews/job/{jobId} (Get all interview rounds for a specific job)
        //POST /api/interviews(Add a new interview round)
        //PUT /api/interviews/{id
        //} (Update interview details)
        //DELETE /api/interviews/{id} (Remove an interview round)

        [HttpGet("job/{jobId}")]
        public async Task<ActionResult<List<Interview>>> GetByJobApplication(int jobApplicationId)
        {
            return await _context.interviews.Where(i => i.JobApplicationId == jobApplicationId).ToListAsync();
        }

        [HttpGet]
        public async Task<ActionResult<List<Interview>>> GetInterviews()
        {
            return Ok(await _context.interviews.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Interview>> GetById(int id)
        {
            var interview = await _context.interviews.Where(j => j.Id == id).FirstOrDefaultAsync();
            return Ok(interview);
        }

        [HttpPost]
        public async Task<ActionResult<Interview>> CreateInterview(Interview interview)
        {
            _context.interviews.Add(interview);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = interview.Id }, interview);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateInterview(int id, Interview interview)
        {
            var exist= await _context.interviews.AnyAsync(i => i.Id == id);

            if (!exist)
            {
                return NotFound();
            }
            _context.interviews.Update(interview);
            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteInterview(int id)
        {
            var interview = await _context.interviews.FindAsync(id);
            if (interview == null) return NotFound();
            _context.interviews.Remove(interview);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
