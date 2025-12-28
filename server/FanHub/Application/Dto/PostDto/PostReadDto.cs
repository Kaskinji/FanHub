namespace Application.Dto.PostDto
{
    public class PostReadDto
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int FandomId { get; set; }

        public int CategoryId { get; set; }

        public string? Title { get; set; }

        public string Content { get; set; } = string.Empty;

        public DateTime PostDate { get; set; }

        public string MediaContent { get; set; } = string.Empty;

        public int ReactionsCount { get; set; }
    }
}
