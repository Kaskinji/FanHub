using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Enums;

namespace Application.Dto.ReactionDto
{
    public class ReactionCreateDto
    {
        public int UserId { get; set; }
        public int PostId { get; set; }
        public ReactionType Type { get; set; }
    }
}
