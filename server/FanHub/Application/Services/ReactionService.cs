using Application.Dto.ReactionDto;
using Application.Extensions;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Extensions;
using Domain.Repositories;
using FluentValidation;

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
            IValidator<Reaction> validator ) : base( repository, mapper, validator )
        {
            _postRepository = postRepository;
            _userRepository = userRepository;
        }

        protected override Reaction InitializeEntity()
        {
            Reaction entity = new();

            entity.Id = IdGenerator.GenerateId();
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