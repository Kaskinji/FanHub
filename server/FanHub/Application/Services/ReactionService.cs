using Application.Dto.ReactionDto;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Extensions;
using Domain.Foundations;
using Domain.Repositories;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class ReactionService : BaseService<Reaction, ReactionCreateDto, ReactionReadDto, ReactionUpdateDto>, IReactionService
    {
        private IPostRepository _postRepository;
        private IUserRepository _userRepository;

        public ReactionService( IReactionRepository repository,
            IPostRepository postRepository,
            IUserRepository userRepository,
            IMapper mapper,
            IValidator<Reaction> validator, 
            ILogger<ReactionService> logger,
            IUnitOfWork unitOfWork ) : base( repository, mapper, validator, logger, unitOfWork )
        {
            _postRepository = postRepository;
            _userRepository = userRepository;
        }

        protected override Reaction InitializeEntity( ReactionCreateDto dto )
        {
            Reaction entity = new();

            entity.Date = DateTime.UtcNow;

            return entity;
        }

        protected override async Task CheckUnique( Reaction Reaction )
        {
            await _userRepository.GetByIdAsyncThrow( Reaction.UserId );
            await _postRepository.GetByIdAsyncThrow( Reaction.PostId );
        }
    }
}