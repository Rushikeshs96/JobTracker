import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private apiUrl = 'https://localhost:7176/api/stripecheckout';

  constructor(private http: HttpClient) {}

  startCheckoutSession(): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.apiUrl}/create-session`, {});
  }
}
