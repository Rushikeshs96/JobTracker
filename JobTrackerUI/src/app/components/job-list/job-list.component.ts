import { Component } from '@angular/core';
import { JobApplication, JobStatus } from '../../models/models';
import { JobService } from '../../services/job.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-list',
  standalone: false,
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.css',
})
export class JobListComponent {
  jobs: JobApplication[] = [];

  constructor(
    private jobService: JobService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadDummyJobs();
  }

  loadDummyJobs(): void {
    this.jobs = [
      {
        id: 1,
        companyName: 'Google',
        jobTitle: 'Software Engineer',
        status: JobStatus.Applied,
        dateApplied: new Date(),
        salaryRange: '120k-150k',
      },
      {
        id: 2,
        companyName: 'Microsoft',
        jobTitle: 'Backend Developer',
        status: JobStatus.Technical,
        dateApplied: new Date(new Date().setDate(new Date().getDate() - 5)),
        salaryRange: '130k-160k',
      },
      {
        id: 3,
        companyName: 'Amazon',
        jobTitle: 'Full Stack Dev',
        status: JobStatus.Offer,
        dateApplied: new Date(new Date().setDate(new Date().getDate() - 10)),
        salaryRange: '140k-180k',
      },
    ];
  }

  getAllJobApplications() {
    this.jobService.getAllJobApplications().subscribe({
      next: (data) => (this.jobs = data),
      error: (error) => console.error('error fetching applications', error),
    });
  }

  editJob(id: number): void {
    this.router.navigate(['/jobs/edit', id]);
  }

  deleteJob(id: number): void {
    if (confirm('Are you sure you want to delete this application?')) {
      this.jobService.deleteJobApplication(id).subscribe(() => {
        this.getAllJobApplications();
      });
    }
  }
}
