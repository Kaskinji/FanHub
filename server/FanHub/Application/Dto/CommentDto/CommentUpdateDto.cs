using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Dto.CommentDto
{
    public class CommentUpdateDto
    {
        public string Content { get; set; } = string.Empty;
    }
}
