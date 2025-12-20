using Application.Dto.CommentDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface ICommentService : IBaseService<Comment, CommentCreateDto, CommentReadDto, CommentUpdateDto>
    {
        Task<List<CommentShowDto>> GetCommentsAsync();
        Task<List<CommentShowDto>> GetCommentsByPostIdAsync( int postId );
    }
}
