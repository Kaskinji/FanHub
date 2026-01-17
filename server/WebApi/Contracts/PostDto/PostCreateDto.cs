namespace WebApi.Contracts.PostDto
{
    public class PostCreateDto
    {
        public int FandomId { get; set; }

        public int CategoryId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public string MediaContent { get; set; } = string.Empty;
    }
}
