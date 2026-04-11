import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InterviewService {
  private baseUrl = `${environment.apiUrl}/Interviews`;

  constructor(private http: HttpClient) { }

  getAllInterviews(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getInterviewById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  getInterviewsByJobId(jobId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/job/${jobId}`);
  }

  createInterview(interview: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, interview);
  }

  updateInterview(id: number, interview: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, interview);
  }

  deleteInterview(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
