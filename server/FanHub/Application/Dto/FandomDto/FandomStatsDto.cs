public class FandomWithStatsDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string GameName { get; set; } = string.Empty;
    public int PostCount { get; set; }
    public int MemberCount { get; set; }
    public DateTime CreationDate { get; set; }
}
