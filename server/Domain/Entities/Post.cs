namespace Domain.Entities;

public class Post : Entity
{
    public int UserId { get; set; }

    public int FandomId { get; set; }

    public int CategoryId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public DateTime PostDate { get; set; }

    public string? MediaContent { get; set; } = null;

    public User User { get; set; } = null!;
    public Fandom Fandom { get; set; } = null!;
    public Category Category { get; set; } = null!;
    public ICollection<Reaction> Reactions { get; set; } = new List<Reaction>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}