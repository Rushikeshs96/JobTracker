using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace JobTracker.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebhookController : ControllerBase
    {
        private readonly string _webhookSecret;

        public WebhookController(IConfiguration configuration)
        {
            _webhookSecret = configuration["Stripe:WebhookSecret"];
        }

        [HttpPost]
        public async Task<IActionResult> Index()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    _webhookSecret
                );

                // Handle the event
                if (stripeEvent.Type == "payment_intent.succeeded")
                {
                    var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
                    Console.WriteLine($"Payment for {paymentIntent.Amount} succeeded!");
                }
                else if (stripeEvent.Type == "payment_intent.payment_failed")
                {
                    var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
                    Console.WriteLine($"Payment failed: {paymentIntent.LastPaymentError?.Message}");
                }

                switch (stripeEvent.Type)
                {
                    case "customer.subscription.created":
                        var sub = stripeEvent.Data.Object as Subscription;

                        // --- GET METADATA HERE ---
                        var userId = sub.Metadata.GetValueOrDefault("AppUserId");
                        var planName = sub.Metadata.GetValueOrDefault("PlanType");

                        Console.WriteLine($"New subscription for User: {userId}, Plan: {planName}");

                        // Now you can do: 
                        // _db.Users.FirstOrDefault(u => u.Id == userId).IsPremium = true;
                        break;

                    case "checkout.session.completed":
                        var session = stripeEvent.Data.Object as Stripe.Checkout.Session;

                        // You can also get it from the session
                        var userIdFromSession = session.Metadata.GetValueOrDefault("AppUserId");
                        break;

                    case "invoice.paid":
                        var invoice = stripeEvent.Data.Object as Invoice;
                        // Note: Invoices often carry metadata from the subscription
                        break;
                }

                return Ok();
            }
            catch (StripeException e)
            {
                return BadRequest();
            }
        }
    }
}

