namespace Domain.Entities;

public class Subscription : Entity
{
    public int UserId { get; set; }

    public int FandomId { get; set; }

    public DateTime Date { get; set; }

    public User User { get; set; } = null!;
    public Fandom Fandom { get; set; } = null!;
}