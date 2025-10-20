using Domain.Enums;

namespace Domain.Entities;

public class Reaction
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int PostId { get; set; }

    public DateTime Date { get; set; }

    public ReactionType Type { get; set; }

    public required User User { get; set; }
    public required Post Post { get; set; }
}