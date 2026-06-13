
using JobTracker.Api.Services;
using JobTracker.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.SemanticKernel;
using Pgvector.EntityFrameworkCore;
using Stripe;

namespace JobTracker.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var geminiApiKey = builder.Configuration["Gemini:ApiKey"]
                   ?? throw new Exception("Gemini API Key is missing.");

            builder.Services.AddKernel()
                // Add Chat Completion (for answering questions)
                .AddGoogleAIGeminiChatCompletion(
                    modelId: "gemini-2.5-flash",
                    apiKey: geminiApiKey)
                // Add Text Embedding (for generating 3072-dimension vectors)
                .AddGoogleAIEmbeddingGenerator(
                    modelId: "gemini-embedding-2",
                    apiKey: geminiApiKey);

            // Add services to the container.
            builder.Services.AddHttpClient<GeminiService>();
            builder.Services.AddScoped<RagService>();
            builder.Services.AddControllers();
            builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(
                builder.Configuration.GetConnectionString("DefaultConnection"),
                npgsqlOptions => npgsqlOptions.UseVector())
             .UseSnakeCaseNamingConvention()
            );

            builder.Services.AddCors(opt => {
                opt.AddPolicy("CorsPolicy", policy => {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200");
                });
            });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var stripeSecretKey = builder.Configuration["Stripe:SecretKey"];
            if (string.IsNullOrWhiteSpace(stripeSecretKey))
            {
                throw new InvalidOperationException(
                    "Stripe:SecretKey is missing. Set it in configuration or user secrets before starting the API.");
            }

            StripeConfiguration.ApiKey = stripeSecretKey;

            var app = builder.Build();

            app.UseCors("CorsPolicy");

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
