using JobTracker.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JobTracker.Domain.Entities
{
    public class JobApplication
    {
        public int Id { get; set; }

        public string? CompanyName { get; set; } = string.Empty;

        public string? JobTitle { get; set; } = string.Empty;

        public string? JobDescription { get; set; }

        public string? JobPostingUrl { get; set; }

        public string? SalaryRange { get; set; }

        public JobStatus? Status { get; set; }

        public DateTime? DateApplied { get; set; }

        public string? Notes { get; set; }

       public ICollection<Interview>? Interviews { get; set; } = new List<Interview>();    

        public ICollection<Contact>? Contacts { get; set; } = new List<Contact>();

    }
}
