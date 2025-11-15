using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Dto.SubscriptionDto
{
    public class SubscriptionCreateDto
    {
        public int UserId { get; set; }
        public int FandomId { get; set; }
    }
}
