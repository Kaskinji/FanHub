using Domain.Enums;

namespace Application.Dto.ReactionDto
{
    public class ReactionUpdateDto
    {
        public DateTime Date { get; set; }
        public ReactionType Type { get; set; }
    }
}
