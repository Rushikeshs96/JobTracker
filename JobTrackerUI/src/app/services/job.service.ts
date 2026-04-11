import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobApplication } from '../models/models';
@Injectable({
  providedIn: 'root',
})
export class JobService {
  
  private baseUrl = `${environment.apiUrl}/Job`;

  constructor(private http: HttpClient){}

  getAllJobApplications(): Observable<JobApplication[]>{
    return this.http.get<JobApplication[]>(this.baseUrl);
  }

  getJobApplicationById(id : number):Observable<JobApplication>{
    return this.http.get<JobApplication>(`${this.baseUrl}/${id}`);
  }

   createJobApplication(Job : JobApplication):Observable<JobApplication>{
    return this.http.post<JobApplication>(this.baseUrl, Job);
  }

   updateJobApplication(id : number, job : JobApplication):Observable<any>{
    return this.http.put<any>(`${this.baseUrl}/${id}`, job);
  }

   deleteJobApplication(id : number):Observable<any>{
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
