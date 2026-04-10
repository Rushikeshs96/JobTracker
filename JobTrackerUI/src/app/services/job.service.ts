import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JobApplication } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  
  private apiUrl = 'https://localhost:5267/api/Job'; 

  constructor(private http : HttpClient){

  }

  getAllJobs(): Observable<JobApplication[]>{
    return this.http.get<JobApplication[]>(this.apiUrl);
  }

  getJobById(id : number): Observable<JobApplication>{
    return this.http.get<JobApplication>(`${this.apiUrl}/${id}`)
  }

  createJob(job:JobApplication): Observable<JobApplication>{
    return this.http.post<JobApplication>(this.apiUrl,job);
  }

  updateJob(id: number, job:JobApplication): Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/${id}`,job)
  }

  deleteJob(id:number): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
  }

}
