namespace Application.Dto.FandomDto
{
    public class FandomStatsDto
    {
        public int Id { get; set; }
        public int GameId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public DateTime CreationDate { get; set; }

        public string Rules { get; set; } = string.Empty;

        public string? CoverImage { get; set; } = null;

        public int SubscribersCount { get; set; }
        public int PostsCount { get; set; }
    }
}
