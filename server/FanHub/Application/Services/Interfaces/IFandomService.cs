using Application.Dto.FandomDto;
using Application.Dto.NotificationDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface IFandomService : IBaseService<Fandom, FandomCreateDto, FandomReadDto, FandomUpdateDto>
    {
        Task<List<FandomReadDto>> SearchByNameAsync( string searchTerm );
        Task<List<FandomReadDto>> SearchByNameAndGameIdAsync( string searchTerm, int gameId );
        Task<List<FandomReadDto>> GetPopularAsync( int limit );
        Task<List<FandomReadDto>> GetPopularByGameAsync( int gameId, int? limit = null );
        Task<FandomStatsDto> GetFandomWithStatsById( int id );
        Task Notify( FandomNotificationCreateDto dto );
    }
}
