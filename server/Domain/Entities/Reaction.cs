using Domain.Enums;

namespace Domain.Entities;

public class Reaction : Entity
{
    public int UserId { get; set; }

    public int PostId { get; set; }

    public DateTime Date { get; set; }

    public ReactionType Type { get; set; }

    public User User { get; set; } = null!;

    public Post Post { get; set; } = null!;
}