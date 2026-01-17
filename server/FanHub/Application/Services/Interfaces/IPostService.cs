using Application.Dto.PostDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface IPostService : IBaseService<Post, PostCreateDto, PostReadDto, PostUpdateDto>
    {
        Task<List<PostStatsDto>> SearchByCategoryNameAsync( string categoryName );
        Task<List<PostStatsDto>> SearchByCategoryIdAsync( int categoryId );
        Task<List<PostStatsDto>> SearchByCategoryAsync( string? categoryName = null, int? categoryId = null );
        Task<List<PostStatsDto>> GetPopularPosts( int? limit = null );
        Task<List<PostStatsDto>> GetPopularPostsByFandom( int fandomId, int? limit = null );
        Task<PostStatsDto> GetPostWithStatsById( int id );
    }
}
