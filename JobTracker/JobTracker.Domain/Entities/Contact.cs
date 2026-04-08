using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JobTracker.Domain.Entities
{
    public class Contact
    {
        public int Id { get; set; }

        public string? FullName { get; set; } = string.Empty;

        public string? Role { get; set; }

        public string? Email { get; set; }

        public string? LinkedInUrl { get; set; }

        public int? JobApplicationId { get; set; }

        public JobApplication? jobApplication { get; set; }
    }
}
