using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Pgvector;


namespace JobTracker.Domain.Entities
{
    public class DocumentChunk
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public string SourceName { get; set; } = string.Empty;

        // 768 dimensions for text-embedding-004
        public Vector Embedding { get; set; }
    }
}
