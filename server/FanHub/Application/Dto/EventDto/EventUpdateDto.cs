namespace Application.Dto.EventDto
{
    public class EventUpdateDto
    {
        public string? Title { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public DateTime? StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? ImageUrl { get; set; } = null;
    }
}
