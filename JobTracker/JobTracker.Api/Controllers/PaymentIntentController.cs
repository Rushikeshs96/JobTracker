using JobTracker.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace JobTracker.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentIntentController : ControllerBase
    {
        [HttpPost("create-payment-intent")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentRequest request)
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = 5000, // $50.00 (Amount in cents)
                Currency = "usd",
                // This ensures Stripe uses the newest payment element features
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true,
                },
            };

            var service = new PaymentIntentService();
            var intent = await service.CreateAsync(options);

            // We only return the ClientSecret to the frontend
            return Ok(new { clientSecret = intent.ClientSecret });
        }
    }
}
