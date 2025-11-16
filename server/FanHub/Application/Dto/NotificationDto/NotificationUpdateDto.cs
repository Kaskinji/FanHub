using Domain.Enums;

namespace Application.Dto.NotificationDto
{
    public class NotificationUpdateDto
    {
        public string Content { get; set; } = string.Empty;
        public NotificationType Type { get; set; }
    }
}