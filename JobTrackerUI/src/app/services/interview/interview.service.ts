import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interview } from '../../models/models';

@Injectable({
  providedIn: 'root',
})
export class InterviewService {
  private baseUrl = `${environment.apiUrl}/Interviews`;

  constructor(private http: HttpClient) {}

  getByJobApplication(jobId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${jobId}`);
  }

  getAllInterviews(): Observable<Interview[]> {
    return this.http.get<Interview[]>(this.baseUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createInterview(interview: Interview): Observable<any> {
    return this.http.post(this.baseUrl, interview);
  }

  updateInterview(id: number, interview: Interview): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, interview);
  }

  deleteInterview(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
