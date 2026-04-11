import { Component, OnInit } from '@angular/core';
import { DashboardStats, Interview } from '../../models/models';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {

  stats: DashboardStats | null = null;
  upcomingInterviews : Interview [] = [];

  constructor(private dashboardService : DashboardService){}

  ngOnInit(): void{
    this.loadDashBordData();
  }

  loadDashBordData():void{
     this.dashboardService.getStats()
     .subscribe({
      next:(data)=> this.stats = data,
      error: (err) => console.error(`error loading stats`, err) 
     });


     this.dashboardService.getUpcomingInterviews()
     .subscribe({
      next:(data)=>this.upcomingInterviews = data,
      error:(error) => console.error('error loading upcoming interviews', error)
     });
  }
}
