import { Component, OnInit } from '@angular/core';
import { DashboardStats, Interview, InterviewType } from '../../models/models';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  stats: DashboardStats | null = null;
  upcomingInterviews: Interview[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    // this.loadDashBordData();
    // this.loadDummyData();

    // 2. Then call the real API
    this.loadDashBordData();
  }

  loadDashBordData(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => (this.stats = data),
      error: (err) => console.error(`error loading stats`, err),
    });

    this.dashboardService.getUpcomingInterviews().subscribe({
      next: (data) => (this.upcomingInterviews = data),
      error: (error) =>
        console.error('error loading upcoming interviews', error),
    });
  }

  loadDummyData(): void {
    this.stats = {
      totalJobs: 15,
      applied: 5,
      phoneScreen: 3,
      technical: 2,
      finalInterview: 1,
      offer: 1,
      rejected: 2,
      ghosted: 1,
    };

    this.upcomingInterviews = [
      {
        id: 1,
        jobApplicationId: 101,
        interviewDate: new Date(),
        type: InterviewType.Technical,
        interviewerName: 'John Doe',
        notes: 'Prepare for LeetCode',
      },
      {
        id: 2,
        jobApplicationId: 102,
        interviewDate: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days from now
        type: InterviewType.Behavioral,
        interviewerName: 'Jane Smith',
      },
    ];
  }
}
