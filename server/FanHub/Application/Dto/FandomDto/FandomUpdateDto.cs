namespace Application.Dto.FandomDto
{
    public class FandomUpdateDto
    {
        public int? GameId { get; set; }

        public string? Name { get; set; } = string.Empty;

        public string? Description { get; set; } = string.Empty;

        public DateTime? CreationDate { get; set; }

        public string? Rules { get; set; } = string.Empty;
    }
}
