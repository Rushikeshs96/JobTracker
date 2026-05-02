using JobTracker.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace JobTracker.Domain.Entities
{
    public class Interview
    {
        public int Id { get; set; }

        public int? JobApplicationId { get; set; }

        public DateTime? InterviewDate { get; set; }

        public InterviewType? Type { get; set; }

        public string? InterviewerName { get; set; }

        public string? Notes { get; set; }

        public string? MeetingLink { get; set; }

        [JsonIgnore]
        public JobApplication? JobApplication { get; set; }

    }
}
