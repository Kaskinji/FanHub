using Domain.Enums;

namespace Domain.Entities;

public class User : Entity
{
    public string Username { get; set; } = string.Empty;

    public string Login { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string? Avatar { get; set; }

    public DateTime RegistrationDate { get; set; }

    public UserRole Role { get; set; }


    public ICollection<Fandom> Fandoms { get; set; } = new List<Fandom>();
    public ICollection<Reaction> Reactions { get; set; } = new List<Reaction>();
    public ICollection<Event> Events { get; set; } = new List<Event>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
    public ICollection<Post> Posts { get; set; } = new List<Post>();
}