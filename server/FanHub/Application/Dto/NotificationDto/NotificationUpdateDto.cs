using Domain.Enums;

namespace Application.Dto.NotificationDto
{
    public class NotificationUpdateDto
    {
        public string? Content { get; set; }
        public NotificationType? Type { get; set; }
    }
}