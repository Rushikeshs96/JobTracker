import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StripeApiService {
  private apiUrl = 'https://localhost:7176/api';

  constructor(private http: HttpClient) {}

  startCheckoutSession(): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.apiUrl}/create-session`, {});
  }

  createPaymentIntent(): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>(
      `${this.apiUrl}/paymentintent/create-payment-intent`,
      {},
    );
  }
}
