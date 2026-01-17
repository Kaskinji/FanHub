using Application.Dto.NotificationDto;
using Domain.Enums;

namespace Application.Dto.NotificationViewedDto
{
    public class NotificationWithViewedDto
    {
        public int Id { get; set; }
        public int FandomId { get; set; }
        public int NotifierId { get; set; }
        public DateTime CreatedAt { get; set; }
        public FandomNotificationType Type { get; set; }
        public int? NotificationViewedId { get; set; }
        public DateTime? ViewedAt { get; set; }
        public bool IsHidden { get; set; }
        public bool IsViewed { get; set; }
    }
}

