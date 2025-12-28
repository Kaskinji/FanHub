namespace Domain.Entities;

public class Fandom : Entity
{
    public int GameId { get; set; }

    public int CreatorId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime CreationDate { get; set; }

    public string Rules { get; set; } = string.Empty;

    public Game Game { get; set; } = null!;

    public User Creator { get; set; } = null!;

    public ICollection<Post> Posts { get; set; } = new List<Post>();
    public ICollection<Event> Events { get; set; } = new List<Event>();
    public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}