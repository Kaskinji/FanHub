using Application.Dto.ReactionDto;

namespace Application.Dto.PostDto
{
    public class PostStatsDto
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int FandomId { get; set; }

        public int CategoryId { get; set; }

        public string? Title { get; set; }

        public DateTime PostDate { get; set; }

        public string Content { get; set; } = string.Empty;

        public string MediaContent { get; set; } = string.Empty;

        public int CommentsCount { get; set; }

        public List<ReactionSummaryDto> ReactionsSummaries { get; set; } = new();
    }
}
