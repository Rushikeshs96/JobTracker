import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { StripeElementsOptions } from '@stripe/stripe-js';
import { StripePaymentElementComponent, StripeService } from 'ngx-stripe';
import { StripeApiService } from '../../../../services/stripe/stripe.service';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  // Access the Stripe Element from the HTML
  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;

  // Configuration for the Stripe UI
  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };

  isProcessing = signal(false);

  constructor(
    private http: HttpClient,
    private stripeService: StripeService,
    private stripeApiService: StripeApiService,
  ) {}

  ngOnInit() {
    // 1. Ask .NET for the Client Secret as soon as the component loads
    this.stripeApiService.createPaymentIntent().subscribe({
      next: (res) => {
        this.elementsOptions.clientSecret = res.clientSecret;
      },
      error: (err) => console.error('Error fetching secret', err),
    });
  }

  confirmPayment() {
    if (this.isProcessing()) return;
    this.isProcessing.set(true);

    // 2. Confirm the payment with Stripe
    this.stripeService
      .confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          return_url: 'http://localhost:4200/payment-success',
        },
      })
      .subscribe((result) => {
        this.isProcessing.set(false);
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          alert(result.error.message);
        }
      });
  }
}
