
using Domain.Entities;

namespace Application.Dto.CommentDto
{
    public class CommentCreateDto
    {
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
