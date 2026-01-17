namespace Application.Dto.SubscriptionDto
{
    public class SubscriptionReadDto
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int FandomId { get; set; }

        public DateTime Date { get; set; }
    }
}
