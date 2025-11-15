namespace Domain.Entities;

public class Comment : Entity
{
    public int PostId { get; set; }

    public int UserId { get; set; }

    public string Content { get; set; } = string.Empty;

    public DateTime CommentDate { get; set; }
    public virtual Post Post { get; set; }
    public virtual User User { get; set; }
}