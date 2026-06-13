using Pgvector;
using System.Text.Json.Nodes;

namespace JobTracker.Api.Services
{
    public class GeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public GeminiService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _apiKey = config["Gemini:ApiKey"] ?? throw new ArgumentNullException("Gemini API Key missing");
        }

        // 1. Generate Embeddings using text-embedding-004
        public async Task<Vector> GetEmbeddingAsync(string text)
        {
            // 1. Use the exact URL from your curl command
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key={_apiKey}";

            // 2. Use the exact model name from your curl command
            var requestBody = new
            {
                model = "models/gemini-embedding-2",
                content = new { parts = new[] { new { text = text } } }
            };

            var response = await _httpClient.PostAsJsonAsync(url, requestBody);

            if (!response.IsSuccessStatusCode)
            {
                var errorText = await response.Content.ReadAsStringAsync();
                throw new Exception($"Gemini API Error [Embeddings] ({response.StatusCode}): {errorText}");
            }

            var jsonResponse = await response.Content.ReadFromJsonAsync<JsonObject>();
            var values = jsonResponse["embedding"]["values"].AsArray().Select(v => (float)v).ToArray();

            return new Vector(values);
        }

        // 2. Generate Chat Response using gemini-1.5-flash
        public async Task<string> GenerateAnswerAsync(string prompt)
        {
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={_apiKey}";

            var requestBody = new
            {
                contents = new[] {
                    new { parts = new[] { new { text = prompt } } }
                }
            };

            var response = await _httpClient.PostAsJsonAsync(url, requestBody);
            if (!response.IsSuccessStatusCode)
            {
                var errorText = await response.Content.ReadAsStringAsync();
                throw new Exception($"Gemini API Error [Embeddings] ({response.StatusCode}): {errorText}");
            }
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadFromJsonAsync<JsonObject>();
            var answer = jsonResponse["candidates"][0]["content"]["parts"][0]["text"].ToString();

            return answer;
        }
    }
}
