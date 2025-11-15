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
        private ICategoryRepository _categoryRepository;
        private IUserRepository _userRepository;

        public ReactionService( IReactionRepository repository,
            IPostRepository postRepository,
            ICategoryRepository categoryRepository,
            IUserRepository userRepository,
            IMapper mapper,
            IValidator<Reaction> validator ) : base( repository, mapper, validator )
        {
            _postRepository = postRepository;
            _categoryRepository = categoryRepository;
            _userRepository = userRepository;
        }

        public override async Task<int> Create( ReactionCreateDto dto )
        {
            Reaction entity = new();

            entity.Id = IdGenerator.GenerateId();
            entity.Date = DateTime.UtcNow;

            _mapper.Map( dto, entity );

            await ExistEntities( entity );

            await _validator.ValidateAndThrowAsync( entity );

            await _repository.CreateAsync( entity );

            return entity.Id;
        }

        public override async Task Update( int id, ReactionUpdateDto dto )
        {
            Reaction entity = await _repository.GetByIdAsyncThrow( id );

            await CanUserEditReaction( id, entity.UserId );

            _mapper.Map( dto, entity );

            await ExistEntities( entity );

            await _validator.ValidateAndThrowAsync( entity );

            _repository.Update( entity );
        }
        public async Task CanUserEditReaction( int ReactionId, int? userId )
        {
            Reaction? Reaction = await _repository.GetByIdAsyncThrow( ReactionId );
            if ( Reaction.UserId != userId )
            {
                throw new UnauthorizedAccessException( "Пользователь может редактировать только свои реакции" );
            }
        }

        protected override async Task ExistEntities( Reaction Reaction )
        {
            await _userRepository.GetByIdAsyncThrow( Reaction.UserId );
            await _postRepository.GetByIdAsyncThrow( Reaction.PostId );
        }
    }
}
