namespace Domain.Entities;

public class Subscription : Entity
{
    public int UserId { get; set; }

    public int FandomId { get; set; }

    public DateTime Date { get; set; }

    public required User User { get; set; }
    public required Fandom Fandom { get; set; }
}