namespace Application.Dto.GameDto
{
    public class GameReadDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime ReleaseDate { get; set; }

        public string Developer { get; set; } = string.Empty;

        public string Publisher { get; set; } = string.Empty;

        public string CoverImage { get; set; } = string.Empty;

        public string Genre { get; set; } = string.Empty;
    }
}
