namespace Application.Dto.NotificationDto
{
    public class NotificationCreateDto
    {
        public int UserId { get; set; }
        public int? PostId { get; set; }
        public int? EventId { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
