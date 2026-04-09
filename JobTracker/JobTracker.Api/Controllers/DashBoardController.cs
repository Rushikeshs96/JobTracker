using JobTracker.Domain.Enums;
using JobTracker.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace JobTracker.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashBoardController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<DashBoardController> _logger;
        public DashBoardController(AppDbContext appDbContext, ILogger<DashBoardController> logger)
        {
            _context = appDbContext;
            _logger = logger;
        }

        // GET: /api/dashboard/stats
        [HttpGet("stats")]
        public async Task<ActionResult> GetStats()
        {
            var stats = new
            {
                Total = await _context.jobApplications.CountAsync(),
                Applied = await _context.jobApplications.CountAsync(j => j.Status == JobStatus.Applied),
                PhoneScreen = await _context.jobApplications.CountAsync(j => j.Status == JobStatus.PhoneScreen),
                Technical = await _context.jobApplications.CountAsync(j => j.Status == JobStatus.Technical),
                FinalInterview = await _context.jobApplications.CountAsync(j => j.Status == JobStatus.FinalInterview),
                Offer = await _context.jobApplications.CountAsync(j => j.Status == JobStatus.Offer),
                Rejected = await _context.jobApplications.CountAsync(j => j.Status == JobStatus.Rejected),
                Ghosted = await _context.jobApplications.CountAsync(j => j.Status == JobStatus.Ghosted)
            };
            return Ok(stats);
        }

        // GET: /api/dashboard/upcoming
        [HttpGet("upcoming")]
        public async Task<ActionResult> GetUpcoming()
        {
            var nextWeek = DateTime.UtcNow.AddDays(7);

            var interviews = await _context.interviews
                .Where(i => i.InterviewDate <= nextWeek && i.InterviewDate >= DateTime.UtcNow)
                .ToListAsync();

            return Ok(interviews);
        }

    }
}
