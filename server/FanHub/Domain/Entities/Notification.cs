namespace Domain.Entities;

public class Notification : Entity
{
    public int UserId { get; set; }

    public int? PostId { get; set; }

    public int? EventId { get; set; }

    public string Content { get; set; } = string.Empty;

    public User User { get; set; } = null!;
    public Post? Post { get; set; }
    public Event? Event { get; set; }
}