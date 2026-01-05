using Domain.Entities;
using Domain.Enums;

namespace Application.Dto.NotificationDto
{
    public class FandomNotificationCreateDto
    {
        public int FandomId { get; set; }

        public int NotifierId { get; set; }

        public FandomNotificationType Type { get; set; }
    }
}
