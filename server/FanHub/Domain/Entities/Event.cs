using Domain.Enums;

namespace Domain.Entities;

public class Event
{
    public int Id { get; set; }
    public int FandomId { get; set; }

    public int OrganizerId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public EventStatus Status { get; set; }

    public required Fandom Fandom { get; set; }
    public required User Organizer { get; set; }
}