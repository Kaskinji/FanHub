using Domain.Enums;

namespace Application.Dto.NotificationDto
{
    public class NotificationReadDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int? PostId { get; set; }
        public int? EventId { get; set; }
        public string Content { get; set; } = string.Empty;
        public NotificationType Type { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
