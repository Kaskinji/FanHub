using Domain.Enums;

namespace Application.Dto.ReactionDto
{
    public class ReactionCreateDto
    {
        public int UserId { get; set; }
        public int PostId { get; set; }
        public ReactionType Type { get; set; }
    }
}
