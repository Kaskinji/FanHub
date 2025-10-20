namespace Domain.Entities;

public class Comment
{
    public int Id { get; set; }

    public int PostId { get; set; }

    public int UserId { get; set; }

    public string Content { get; set; } = string.Empty;

    public DateTime CommentDate { get; set; }

    public required Post Post { get; set; }
    public required User User { get; set; }
}