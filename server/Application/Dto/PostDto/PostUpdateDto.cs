namespace Application.Dto.PostDto
{
    public class PostUpdateDto
    {
        public int? CategoryId { get; set; }

        public string? Title { get; set; } = null;

        public string? Content { get; set; } = null;

        public string? MediaContent { get; set; } = null;
    }
}
