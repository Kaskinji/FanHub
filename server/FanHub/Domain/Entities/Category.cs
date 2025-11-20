
namespace Domain.Entities;

public class Category : Entity
{
    public string Name { get; set; } = string.Empty;

    public string Icon { get; set; } = string.Empty;

    public ICollection<Post> Posts { get; set; } = new List<Post>();
}