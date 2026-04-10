import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashboardStats, Interview } from '../models/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'https://localhost:5267/api/DashBoard'; 

  constructor(private http: HttpClient) { }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }

  getUpcomingInterviews(): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.apiUrl}/upcoming`);
  }
}

