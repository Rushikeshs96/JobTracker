import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Interview } from '../models/models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InterviewService  {
  private apiUrl = 'https://localhost:5267/api/Interviews';

  constructor(private http: HttpClient) { }

  getAllInterviews(): Observable<Interview[]> {
    return this.http.get<Interview[]>(this.apiUrl);
  }

  getInterviewById(id: number): Observable<Interview> {
    return this.http.get<Interview>(`${this.apiUrl}/${id}`);
  }

  getInterviewsByJobId(jobId: number): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.apiUrl}/job/${jobId}`);
  }

  createInterview(interview: Interview): Observable<Interview> {
    return this.http.post<Interview>(this.apiUrl, interview);
  }

  updateInterview(id: number, interview: Interview): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, interview);
  }

  deleteInterview(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
