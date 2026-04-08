using JobTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JobTracker.Infrastructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<JobApplication> jobApplications { get; set; }
        public DbSet<Interview> interviews { get; set; }
        public DbSet<Contact> contacts { get; set; }


        //on modelcreating is not compulsury if proper relation is already there in entities. if you want to exmplicitly add relations in appdbscontext or  add validations then you can use onmodelcreating
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<JobApplication>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.CompanyName)
                      .HasMaxLength(200);

                entity.Property(e => e.JobTitle)
                      .HasMaxLength(200);

                // One JobApplication → Many Interviews
                entity.HasMany(e => e.interviews)
                      .WithOne(i => i.jobApplication)
                      .HasForeignKey(i => i.JobApplicationId)
                      .OnDelete(DeleteBehavior.Cascade);

                // One JobApplication → Many Contacts (optional FK)
                entity.HasMany(e => e.contacts)
                      .WithOne(c => c.jobApplication)
                      .HasForeignKey(c => c.JobApplicationId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // Interview Configuration
            modelBuilder.Entity<Interview>(entity =>
            {
                entity.HasKey(e => e.Id);

            });

            // Contact Configuration
            modelBuilder.Entity<Contact>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.FullName)
                      .HasMaxLength(200);

                entity.Property(e => e.Email)
                      .HasMaxLength(200);
            });
        }
    }
}
