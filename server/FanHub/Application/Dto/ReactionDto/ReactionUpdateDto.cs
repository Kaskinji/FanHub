using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;

namespace Application.Dto.ReactionDto
{
    public class ReactionUpdateDto
    {
        public DateTime Date { get; set; }
        public ReactionType Type { get; set; }
    }
}
