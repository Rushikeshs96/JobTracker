using JobTracker.Domain.Entities;
using JobTracker.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<JobController> _logger;
        public JobController(AppDbContext appDbContext, ILogger<JobController> logger)
        {
            _context = appDbContext;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<List<JobApplication>>> GetAllJobApplications()
        {
            var jobs = await _context.jobApplications.Include(c=>c.Contacts).Include(c=>c.Interviews).ToListAsync();
            return Ok(jobs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<JobApplication>> GetJobApplication(int id)
        {
            var job =  await _context.jobApplications
                .Include(j=>j.Interviews)
                .Include(j=>j.Contacts)
                .Where(j => j.Id == id).FirstOrDefaultAsync();

            if(job == null)
            {
                return NotFound();
            }
            return Ok(job);
        }

        [HttpPost]
        public async Task<ActionResult<JobApplication>> CreateJobApplication(JobApplication jobApplication)
        {
            if (jobApplication.DateApplied.HasValue)
            {
                jobApplication.DateApplied = jobApplication.DateApplied.Value.ToUniversalTime();
            }
            if (jobApplication.Interviews != null && jobApplication.Interviews.Any())
            {
                foreach (var interview in jobApplication.Interviews)
                {
                    if (interview.InterviewDate.HasValue)
                    {
                        interview.InterviewDate = interview.InterviewDate.Value.ToUniversalTime();
                    }
                }
            }
            _context.jobApplications.Add(jobApplication);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetJobApplication), new { id = jobApplication.Id }, jobApplication);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateJobApplication(int id,JobApplication jobApplication)
        {
           if(id != jobApplication.Id)
            {
                return BadRequest();
            }

            if (jobApplication.DateApplied.HasValue)
            {
                jobApplication.DateApplied = jobApplication.DateApplied.Value.ToUniversalTime();
            }
            if (jobApplication.Interviews != null && jobApplication.Interviews.Any())
            {
                foreach (var interview in jobApplication.Interviews)
                {
                    if (interview.InterviewDate.HasValue)
                    {
                        interview.InterviewDate = interview.InterviewDate.Value.ToUniversalTime();
                    }
                }
            }

            var exists = await _context.jobApplications.AnyAsync(j=>j.Id == jobApplication.Id);
            if (!exists) { return NotFound(); };

            _context.jobApplications.Update(jobApplication);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteJobApplication(int id)
        {
            var job = await _context.jobApplications.FindAsync(id);
            if(job == null)
            {
                return NotFound();
            }
            _context.jobApplications.Remove(job);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
