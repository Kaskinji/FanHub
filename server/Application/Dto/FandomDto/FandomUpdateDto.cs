namespace Application.Dto.FandomDto
{
    public class FandomUpdateDto
    {
        public int? GameId { get; set; } = null;

        public string? Name { get; set; } = null;

        public string? Description { get; set; } = null;

        public string? Rules { get; set; } = null;

        public string? CoverImage { get; set; } = null;
    }
}
