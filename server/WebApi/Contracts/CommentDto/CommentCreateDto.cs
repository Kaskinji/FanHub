namespace WebApi.Contracts.CommentDto
{
    public class CommentCreateDto
    {
        public int PostId { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
