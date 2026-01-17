using Domain.Enums;

namespace WebApi.Contracts.ReactionDto
{
    public class ReactionCreateDto
    {
        public int PostId { get; set; }
        public ReactionType Type { get; set; }
    }
}
