namespace Application.Dto.GameDto
{
    public class GameCreateDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime ReleaseDate { get; set; }

        public string Developer { get; set; } = string.Empty;

        public string Publisher { get; set; } = string.Empty;

        public string CoverImage { get; set; } = string.Empty;

        public string Genre { get; set; } = string.Empty;
    }
}