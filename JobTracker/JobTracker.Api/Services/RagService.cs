using JobTracker.Domain.Entities;
using JobTracker.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Pgvector.EntityFrameworkCore;

namespace JobTracker.Api.Services
{
    public class RagService
    {
        private readonly AppDbContext _dbContext;
        private readonly GeminiService _geminiService;

        public RagService(AppDbContext dbContext, GeminiService geminiService)
        {
            _dbContext = dbContext;
            _geminiService = geminiService;
        }

        // Save user info to DB with vector embedding
        public async Task SaveUserInfoAsync(string content, string sourceName)
        {
            var embedding = await _geminiService.GetEmbeddingAsync(content);

            var chunk = new DocumentChunk
            {
                Content = content,
                SourceName = sourceName,
                Embedding = embedding
            };

            _dbContext.DocumentChunks.Add(chunk);
            await _dbContext.SaveChangesAsync();
        }

        // Ask question using RAG
        public async Task<string> AskQuestionAsync(string question)
        {
            // 1. Embed the user's question
            var questionEmbedding = await _geminiService.GetEmbeddingAsync(question);

            // 2. Vector Search: Find top 3 most relevant chunks using Cosine Distance
            var relevantChunks = await _dbContext.DocumentChunks
                .OrderBy(c => c.Embedding.CosineDistance(questionEmbedding))
                .Take(3)
                .ToListAsync();

            // 3. Construct the prompt with context
            var contextText = string.Join("\n\n", relevantChunks.Select(c => c.Content));

            var prompt = $@"
You are a helpful assistant for the JobTracker application. 
Use the following pieces of retrieved context to answer the user's question. 
If you don't know the answer based on the context, just say that you don't know.

Context:
{contextText}

Question: {question}
Answer:";

            // 4. Get answer from Gemini
            var answer = await _geminiService.GenerateAnswerAsync(prompt);
            return answer;
        }
    }

}
