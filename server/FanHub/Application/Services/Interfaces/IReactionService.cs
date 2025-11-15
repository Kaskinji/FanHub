using Application.Dto.ReactionDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface IReactionService : IBaseService<Reaction, ReactionCreateDto, ReactionReadDto, ReactionUpdateDto>
    {
        Task CanUserEditReaction( int ReactionId, int? userId );
    }
}
