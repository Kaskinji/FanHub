using Application.Dto.GameDto;
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
        private IPostRepository _postRepository;
        private IFandomService _fandomService;
        private ICategoryService _categoryService;
        private IUserService _userService;

        public PostService( IPostRepository repository,
            IFandomService fandomService,
            ICategoryService categoryService,
            IUserService userService,
            IMapper mapper,
            IValidator<Post> validator ) : base( repository, mapper, validator )
        {
            _postRepository = repository;
            _fandomService = fandomService;
            _categoryService = categoryService;
            _userService = userService;
        }

        public override async Task<int> Create( PostCreateDto dto )
        {
            await ExistPostItems( dto.FandomId, dto.UserId, dto.CategoryId );
            // todo: добавить notifications
            Post post = new();
            post.Id = IdGenerator.GenerateId();

            _mapper.Map( dto, post );

            _validator.Validate( post );

            await _repository.CreateAsync( post );

            return post.Id;
        }

        public async Task<List<PostReadDto>> GetByCategoryId( int categoryId )
        {
            List<Post> posts = await _postRepository.GetAllByCategoryId( categoryId );

            return _mapper.Map<List<PostReadDto>>( posts );
        }

        public async Task<List<PostReadDto>> GetByUserId( int userId )
        {
            List<Post> posts = await _postRepository.GetAllByUserId( userId );

            return _mapper.Map<List<PostReadDto>>( posts );
        }

        public override async Task Update( int id, PostUpdateDto dto )
        {
            Post post = await _repository.GetByIdAsyncThrow( id );

            _mapper.Map( dto, post );

            await ExistPostItems( post.FandomId, post.UserId, post.CategoryId );

            await _validator.ValidateAndThrowAsync( post );

            _repository.Update( post );
        }

        private async Task ExistPostItems( int fandomId, int userId, int categoryId )
        {
            await _fandomService.GetById( fandomId );
            await _userService.GetById( userId );
            await _categoryService.GetById( categoryId );
        }
    }
}
