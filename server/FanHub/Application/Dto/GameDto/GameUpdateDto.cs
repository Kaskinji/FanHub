namespace Application.Dto.GameDto
{
    public class GameUpdateDto
    {
        public string? Title { get; set; }

        public string? Description { get; set; }

        public DateTime? ReleaseDate { get; set; } = null;

        public string? Developer { get; set; }

        public string? Publisher { get; set; }

        public string? CoverImage { get; set; }

        public string? Genre { get; set; }
    }
}