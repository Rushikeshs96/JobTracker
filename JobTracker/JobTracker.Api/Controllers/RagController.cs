using JobTracker.Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RagController : ControllerBase
    {
        private readonly RagService _ragService;

        public RagController(RagService ragService)
        {
            _ragService = ragService;
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveInfo([FromBody] SaveRequest request)
        {
            await _ragService.SaveUserInfoAsync(request.Content, request.SourceName);
            return Ok(new { message = "Information saved successfully." });
        }

        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] ChatRequest request)
        {
            var answer = await _ragService.AskQuestionAsync(request.Question);
            return Ok(new { answer = answer });
        }
    }

    public class SaveRequest
    {
        public string Content { get; set; }
        public string SourceName { get; set; }
    }

    public class ChatRequest
    {
        public string Question { get; set; }
    }
}
