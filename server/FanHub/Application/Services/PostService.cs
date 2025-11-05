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
    public class PostService : IPostService
    {
        private IMapper _mapper;
        private IValidator<Post> _validator;

        private IFandomService _fandomService;
        private ICategoryService _categoryService;
        private IUserService _userService;

        private IPostRepository _repository;

        public PostService( IPostRepository repository,
            IFandomService fandomService,
            ICategoryService categoryService,
            IUserService userService,
            IMapper mapper,
            IValidator<Post> validator )
        {
            _repository = repository;
            _fandomService = fandomService;
            _categoryService = categoryService;
            _userService = userService;
            _mapper = mapper;
            _validator = validator;
        }

        public async Task<int> Create( PostCreateDto dto )
        {
            await _fandomService.GetById( dto.FandomId );

            Post post = new();
            post.Id = IdGenerator.GenerateId();

            _mapper.Map( dto, post );

            _validator.Validate( post );

            await _repository.CreateAsync( post );

            return post.Id;
        }

        public async Task Delete( int id )
        {
            Post post = await _repository.GetByIdAsyncThrow( id );

            _repository.Delete( post );
        }

        public async Task<List<PostReadDto>> GetAll()
        {
            List<Post> posts = await _repository.GetAllAsync();

            return _mapper.Map<List<PostReadDto>>( posts );
        }

        public async Task<PostReadDto> GetById( int id )
        {
            Post post = await _repository.GetByIdAsyncThrow( id );

            PostReadDto postReadDto = new();
            _mapper.Map( post, postReadDto );

            return postReadDto;
        }

        public async Task Update( int id, PostUpdateDto dto )
        {
            Post post = await _repository.GetByIdAsyncThrow( id );

            _mapper.Map( dto, post );
            await _validator.ValidateAndThrowAsync( post );

            _repository.Update( post );
        }
    }
}
