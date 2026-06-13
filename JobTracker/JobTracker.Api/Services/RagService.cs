using JobTracker.Domain.Entities;
using JobTracker.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.AI;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Embeddings;
using Pgvector;
using Pgvector.EntityFrameworkCore;

namespace JobTracker.Api.Services
{
    //    public class RagService
    //    {
    //        private readonly AppDbContext _dbContext;
    //        private readonly GeminiService _geminiService;

    //        public RagService(AppDbContext dbContext, GeminiService geminiService)
    //        {
    //            _dbContext = dbContext;
    //            _geminiService = geminiService;
    //        }

    //        // Save user info to DB with vector embedding
    //        public async Task SaveUserInfoAsync(string content, string sourceName)
    //        {
    //            var embedding = await _geminiService.GetEmbeddingAsync(content);

    //            var chunk = new DocumentChunk
    //            {
    //                Content = content,
    //                SourceName = sourceName,
    //                Embedding = embedding
    //            };

    //            _dbContext.DocumentChunks.Add(chunk);
    //            await _dbContext.SaveChangesAsync();
    //        }

    //        // Ask question using RAG
    //        public async Task<string> AskQuestionAsync(string question)
    //        {
    //            // 1. Embed the user's question
    //            var questionEmbedding = await _geminiService.GetEmbeddingAsync(question);

    //            // 2. Vector Search: Find top 3 most relevant chunks using Cosine Distance
    //            var relevantChunks = await _dbContext.DocumentChunks
    //                .OrderBy(c => c.Embedding.CosineDistance(questionEmbedding))
    //                .Take(3)
    //                .ToListAsync();

    //            // 3. Construct the prompt with context
    //            var contextText = string.Join("\n\n", relevantChunks.Select(c => c.Content));

    //            var prompt = $@"
    //You are a helpful assistant for the JobTracker application. 
    //Use the following pieces of retrieved context to answer the user's question. 
    //If you don't know the answer based on the context, just say that you don't know or similar sentances.

    //Context:
    //{contextText}

    //Question: {question}
    //Answer:";

    //            // 4. Get answer from Gemini
    //            var answer = await _geminiService.GenerateAnswerAsync(prompt);
    //            return answer;
    //        }
    //    }

    public class RagService
    {
        private readonly AppDbContext _dbContext;
        private readonly IEmbeddingGenerator<string, Embedding<float>> _embeddingService; 
        private readonly IChatCompletionService _chatService;

        public RagService(
                            AppDbContext dbContext,
                            IEmbeddingGenerator<string, Embedding<float>> embeddingService,
                            IChatCompletionService chatService)
        {
            _dbContext = dbContext;
            _embeddingService = embeddingService;
            _chatService = chatService;
        }

        // Save user info to DB with vector embedding
        public async Task SaveUserInfoAsync(string content, string sourceName)
        {
            // 1. Generate embedding using Semantic Kernel
            var embedding = await _embeddingService.GenerateAsync(content);
            var embeddingArray = embedding.Vector.ToArray();

            var chunk = new DocumentChunk
            {
                Content = content,
                SourceName = sourceName,
                Embedding = new Vector(embeddingArray) // 3072 dimensions
            };

            _dbContext.DocumentChunks.Add(chunk);
            await _dbContext.SaveChangesAsync();
        }

        // Ask question using RAG
        public async Task<string> AskQuestionAsync(string question)
        {
            // 1. Embed the user's question using Semantic Kernel
            var questionEmbedding = await _embeddingService.GenerateAsync(question);
            var questionVector = new Vector(questionEmbedding.Vector.ToArray());

            // 2. Vector Search: Find top 3 most relevant chunks using EF Core & pgvector
            var relevantChunks = await _dbContext.DocumentChunks
                .OrderBy(c => c.Embedding.CosineDistance(questionVector))
                .Take(3)
                .ToListAsync();

            var contextText = string.Join("\n\n", relevantChunks.Select(c => c.Content));

            // 3. Construct the Chat History using Semantic Kernel
            var chatHistory = new ChatHistory("You are a helpful assistant for the JobTracker application. Use the provided context to answer the user's question. If you don't know the answer based on the context, just say that you don't know.");

            // Add the context and the user's question
            chatHistory.AddUserMessage($@"
Context:
{contextText}

Question: {question}");

            // 4. Get answer from Gemini using Semantic Kernel
            var response = await _chatService.GetChatMessageContentAsync(chatHistory);

            return response.Content ?? "Sorry, I couldn't generate a response.";
        }
    }

}
