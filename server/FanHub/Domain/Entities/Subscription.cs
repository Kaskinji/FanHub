namespace Domain.Entities;

public class Subscription
{
    public int SubscriptionId { get; set; }

    public int UserId { get; set; }

    public int FandomId { get; set; }

    public DateTime Date { get; set; }

    public required User User { get; set; }
    public required Fandom Fandom { get; set; }
}