import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private baseUrl = `${environment.apiUrl}/Contacts`;

  constructor(private http: HttpClient) { }

  getAllContacts(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getContactById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  getContactsByJobId(jobId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/jobApplicationId/${jobId}`);
  }

  createContact(contact: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, contact);
  }

  updateContact(id: number, contact: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}`, contact);
  }

  deleteContact(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
