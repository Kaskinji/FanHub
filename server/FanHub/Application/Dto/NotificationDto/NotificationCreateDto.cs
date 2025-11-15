using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;

namespace Application.Dto.NotificationDto
{
    public class NotificationCreateDto
    {
        public int UserId { get; set; }
        public int? PostId { get; set; }
        public int? EventId { get; set; }
        public string Content { get; set; } = string.Empty;
        public NotificationType Type { get; set; }

    }
}
