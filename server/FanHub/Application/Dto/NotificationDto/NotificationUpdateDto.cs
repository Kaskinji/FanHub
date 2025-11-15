using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;

namespace Application.Dto.NotificationDto
{
    public class NotificationUpdateDto
    {
        public string? Content { get; set; }
        public NotificationType? Type { get; set; }
    }
}