using Application.Dto.PostDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface IPostService : IBaseService<Post, PostCreateDto, PostReadDto, PostUpdateDto>
    {
    }
}
