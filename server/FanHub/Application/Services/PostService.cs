using Application.Dto.PostDto;
using Application.Extensions;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Extensions;
using Domain.Repositories;
using FluentValidation;

namespace Application.Services
{
    public class PostService : BaseService<Post, PostCreateDto, PostReadDto, PostUpdateDto>, IPostService
    {
        private readonly IFandomRepository _fandomRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IUserRepository _userRepository;

        public PostService( IPostRepository repository,
            IFandomRepository fandomRepository,
            ICategoryRepository categoryRepository,
            IUserRepository userRepository,
            IMapper mapper,
            IValidator<Post> validator ) : base( repository, mapper, validator )
        {
            _fandomRepository = fandomRepository;
            _categoryRepository = categoryRepository;
            _userRepository = userRepository;
        }

        public override async Task<int> Create( PostCreateDto dto )
        {
            Post entity = new();

            entity.Id = IdGenerator.GenerateId();
            entity.PostDate = DateTime.UtcNow;

            _mapper.Map( dto, entity );

            await ExistEntities( entity );

            await _validator.ValidateAndThrowAsync( entity );

            await _repository.CreateAsync( entity );

            return entity.Id;
        }

        public override async Task Update( int id, PostUpdateDto dto )
        {
            await CanUserEditPost( id, dto.UserId );
            await base.Update( id, dto );
        }
        public async Task CanUserEditPost( int postId, int? userId )
        {
            Post? post = await _repository.GetByIdAsyncThrow( postId );
            if ( post.UserId == userId )
            {
                throw new UnauthorizedAccessException( "Пользователь может редактировать только свои посты" );
            }
        }

        protected override async Task ExistEntities( Post post )
        {
            await _fandomRepository.GetByIdAsyncThrow( post.FandomId );
            await _userRepository.GetByIdAsyncThrow( post.UserId );
            await _categoryRepository.GetByIdAsyncThrow( post.CategoryId );
        }
    }
}
