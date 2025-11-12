namespace Domain.Entities;

public class Post : Entity
{
    public int UserId { get; set; }

    public int FandomId { get; set; }

    public int CategoryId { get; set; }

    public string Title { get; set; }

    public string Content { get; set; }

    public DateTime PostDate { get; set; }

    public string MediaContent { get; set; } = string.Empty;

}