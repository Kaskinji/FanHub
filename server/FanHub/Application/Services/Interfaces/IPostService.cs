using Application.Dto.PostDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface IPostService : IBaseService<Post, PostCreateDto, PostReadDto, PostUpdateDto>
    {
        Task<List<PostReadDto>> SearchByCategoryNameAsync( string categoryName );
        Task<List<PostReadDto>> SearchByCategoryIdAsync( int categoryId );
        Task<List<PostReadDto>> SearchByCategoryAsync( string? categoryName = null, int? categoryId = null );
    }
}
