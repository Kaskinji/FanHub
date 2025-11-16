namespace Application.Dto.EventDto
{
    public class EventCreateDto
    {
        public int FandomId { get; set; }
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }
}
