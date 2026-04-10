import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
   private apiUrl = 'https://localhost:5267/api/Contacts'; 

   constructor(private http: HttpClient){}

   getContacts():Observable<Contact[]>{
    return this.http.get<Contact[]>(this.apiUrl)
   }

   getContactById(id : number): Observable<Contact>{
    return this.http.get<Contact>(`${this.apiUrl}/${id}`)
   }

    getContactsByJobId(jobId: number): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/jobApplicationId/${jobId}`);
  }

   createContact(contact: Contact):Observable<Contact>{
    return this.http.post<Contact>(this.apiUrl,contact);
   }

   updateContact(id:number, contact :Contact): Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/${id}`,contact);
   }

   deleteContact(id: number): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
   }
}
