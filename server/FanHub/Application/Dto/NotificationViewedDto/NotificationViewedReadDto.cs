namespace Application.Dto.NotificationViewedDto
{
    public class NotificationViewedReadDto
    {
        public int Id { get; set; }
        public int NotificationId { get; set; }
        public int UserId { get; set; }
        public DateTime ViewedAt { get; set; }
        public bool IsHidden { get; set; }
    }
}

