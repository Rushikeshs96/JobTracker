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

                return Ok();
            }
            catch (StripeException e)
            {
                return BadRequest();
            }
        }
    }
}

