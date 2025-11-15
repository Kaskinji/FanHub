using Domain.Enums;

namespace Application.Dto.EventDto
{
    public class EventReadDto
    {
        public int Id { get; set; }
        public int FandomId { get; set; }
        public int OrganizerId { get; set; }
        public string OrganizerName { get; set; } = string.Empty;
        public string FandomName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }
}
