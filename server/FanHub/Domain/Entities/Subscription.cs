namespace Domain.Entities;

public class Subscription : Entity
{
    public int UserId { get; set; }

    public int FandomId { get; set; }

    public DateTime Date { get; set; }

    public virtual User User { get; set; }
    public virtual Fandom Fandom { get; set; }
}