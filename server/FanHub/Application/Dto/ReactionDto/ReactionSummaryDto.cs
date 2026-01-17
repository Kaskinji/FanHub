using Domain.Enums;

namespace Application.Dto.ReactionDto
{
    public class ReactionSummaryDto
    {
        public ReactionType ReactionType { get; set; }

        public int Count { get; set; }
    }
}
