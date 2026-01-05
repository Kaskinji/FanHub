namespace Domain.Entities
{
    public class NotificationViewed : Entity
    {
        public int NotificationId { get; set; }

        public int UserId { get; set; }

        public DateTime ViewedAt { get; set; } = DateTime.UtcNow;

        public bool IsHidden { get; set; } = false;

        public FandomNotification Notification { get; set; } = null!;

        public User User { get; set; } = null!;
    }
}

