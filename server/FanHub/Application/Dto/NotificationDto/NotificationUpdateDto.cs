using Domain.Enums;

namespace Application.Dto.NotificationDto
{
    public class NotificationUpdateDto
    {
        public int? UserId { get; set; }

        public int? PostId { get; set; }

        public int? EventId { get; set; }

        public string? Content { get; set; }

        public NotificationType? Type { get; set; }
    }
}
