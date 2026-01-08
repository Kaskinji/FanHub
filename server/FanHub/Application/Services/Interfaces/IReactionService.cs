using System.Collections.Generic;
using Application.Dto.PostDto;
using Application.Dto.ReactionDto;
using Domain.Entities;
using Domain.Repositories;

namespace Application.Services.Interfaces
{
    public interface IReactionService : IBaseService<Reaction, ReactionCreateDto, ReactionReadDto, ReactionUpdateDto>
    {
        Task<IReadOnlyList<ReactionReadDto>> GetByPostId( int postId );
    }
}
