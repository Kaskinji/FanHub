using Domain.Enums;

namespace Application.Dto.ReactionDto
{
    public class ReactionReadDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int PostId { get; set; }
        public DateTime Date { get; set; }
        public ReactionType Type { get; set; }

    }
}
