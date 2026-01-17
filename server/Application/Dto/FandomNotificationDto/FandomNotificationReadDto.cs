using Domain.Entities;
using Domain.Enums;

namespace Application.Dto.NotificationDto
{
    public class FandomNotificationReadDto
    {
        public int Id { get; set; }

        public int FandomId { get; set; }

        public int NotifierId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public FandomNotificationType Type { get; set; }
    }
}
