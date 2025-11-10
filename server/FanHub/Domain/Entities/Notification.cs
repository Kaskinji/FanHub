using Domain.Enums;

namespace Domain.Entities;

public class Notification : Entity
{
    public int UserId { get; set; }

    public int? PostId { get; set; }

    public int? EventId { get; set; }

    public string Content { get; set; } = string.Empty;

    public NotificationType Type { get; set; }

    public required User User { get; set; }
    public Post? Post { get; set; }
    public Event? Event { get; set; }
}