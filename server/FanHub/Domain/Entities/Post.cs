using Domain.Enums;

namespace Domain.Entities;

public class Post
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int FandomId { get; set; }

    public int CategoryId { get; set; }

    public required string Title { get; set; }

    public required string Content { get; set; }

    public DateTime PostDate { get; set; }

    public string MediaContent { get; set; } = string.Empty;

    public PostStatus Status { get; set; }

    public required User User { get; set; }
    public required Fandom Fandom { get; set; }
    public required Category Category { get; set; }
}