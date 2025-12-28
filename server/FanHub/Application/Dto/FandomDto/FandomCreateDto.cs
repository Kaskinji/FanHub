namespace Application.Dto.FandomDto
{
    public class FandomCreateDto
    {
        public int GameId { get; set; }

        public int CreatorId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Rules { get; set; } = string.Empty;
    }
}
