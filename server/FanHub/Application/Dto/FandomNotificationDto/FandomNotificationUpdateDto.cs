using Domain.Enums;

namespace Application.Dto.NotificationDto
{
    public class FandomNotificationUpdateDto
    {
        public int NotifierId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public FandomNotificationType Type { get; set; }
    }
}