import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../../models/models';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private baseUrl = `${environment.apiUrl}/Contacts`;

  constructor(private http: HttpClient) {}

  getAllContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.baseUrl);
  }

  getContactById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createContact(Contact: Contact): Observable<any> {
    return this.http.post<any>(this.baseUrl, Contact);
  }

  updateContact(id: number, Contact: Contact): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, Contact);
  }

  deleteContact(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  getContactsByJobApplicationId(id: number): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.baseUrl}/jobApplicationId/${id}`);
  }
}
