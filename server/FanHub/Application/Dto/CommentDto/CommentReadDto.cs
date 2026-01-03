namespace Application.Dto.CommentDto
{
    public class CommentReadDto
    {
        public int Id { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CommentDate { get; set; }
    }
}
