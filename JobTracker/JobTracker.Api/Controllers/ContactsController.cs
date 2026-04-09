using JobTracker.Domain.Entities;
using JobTracker.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace JobTracker.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ContactsController> _logger;
        public ContactsController(AppDbContext appDbContext, ILogger<ContactsController> logger)
        {
            _context = appDbContext;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<List<Contact>>> GetAllContacts()
        {
            var contacts = await _context.contacts.ToListAsync();
            return Ok(contacts);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetContactById(int id)
        {
            var contact = await _context.contacts.FindAsync(id);
            return Ok(contact);
        }

        [HttpPost]
        public async Task<ActionResult> CreateContact(Contact contact)
        {
            _context.contacts.Add(contact);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetContactById), new { id = contact.Id }, contact);
        }

        [HttpPost("{id}")]
        public async Task<ActionResult> UpdateContact(int id,Contact contact)
        {
            _context.contacts.Update(contact);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteContact(int id)
        {
            var contcat = await _context.contacts.FindAsync(id);
            if (contcat == null) return NotFound();
            _context.contacts.Remove(contcat);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("jobApplicationId/{id}")]
        public async Task<ActionResult<List<Contact>>> GetContactsByJobApplicationId(int jobId)
        {
            var contacts = await _context.contacts.Where(c => c.JobApplicationId == jobId).ToListAsync();
            return Ok(contacts);
        }

    }
}
