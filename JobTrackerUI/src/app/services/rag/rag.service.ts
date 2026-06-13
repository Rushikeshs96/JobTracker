import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RagService {
  private baseUrl = `${environment.apiUrl}/Rag`; // Update to your .NET port (e.g., 5000, 5001, 7000)

  constructor(private http: HttpClient) {}

  saveInfo(content: string, sourceName: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/save`, { content, sourceName });
  }

  askQuestion(question: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/chat`, { question });
  }
}
