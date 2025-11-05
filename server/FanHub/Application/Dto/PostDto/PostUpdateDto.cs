using Domain.Enums;

namespace Application.Dto.PostDto
{
    public class PostUpdateDto
    {
        public int? UserId { get; set; }

        public int? FandomId { get; set; }

        public int? CategoryId { get; set; }

        public string? Title { get; set; }

        public string? Content { get; set; }

        public DateTime? PostDate { get; set; }

        public string? MediaContent { get; set; }

        public PostStatus? Status { get; set; }
    }
}
