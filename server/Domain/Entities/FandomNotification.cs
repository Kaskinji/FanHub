using Domain.Enums;

namespace Domain.Entities
{
    public class FandomNotification : Entity
    {
        public int FandomId { get; set; }

        public int NotifierId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public FandomNotificationType Type { get; set; }

        public Fandom Fandom { get; set; } = null!;

        public ICollection<NotificationViewed> NotificationsViewed { get; set; } = new List<NotificationViewed>();
    }
}
