using Application.Dto.PostDto;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Extensions;
using Domain.Repositories;
using FluentValidation;

namespace Application.Services
{
    public class PostService : BaseService<Post, PostCreateDto, PostReadDto, PostUpdateDto>, IPostService
    {
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
            _fandomService = fandomService;
            _categoryService = categoryService;
            _userService = userService;
        }

        public override async Task<int> Create( PostCreateDto dto )
        {
            bool isUserInFandom = await IsUserInFandomAsync( dto.UserId, dto.FandomId );
            if ( !isUserInFandom )
            {
                throw new ValidationException( "Пользователь не является участником фандома" );
            }

            int postId = await base.Create( dto );

            Post? createdPost = await _repository.GetByIdAsync( postId );
            createdPost.PostDate = DateTime.UtcNow;
            createdPost.Status = PostStatus.Created;
            _repository.Update( createdPost );

            return postId;
        }

        public override async Task Update( int id, PostUpdateDto dto )
        {
            var existingPost = await _repository.GetByIdAsyncThrow( id );

            if ( !await CanUserEditPostAsync( dto.UserId, id ) )
            {
                throw new ValidationException( "Недостаточно прав для редактирования поста" );
            }

            await base.Update( id, dto );

            var updatedPost = await _repository.GetByIdAsync( id );
            updatedPost.PostDate = DateTime.UtcNow;
            _repository.Update( updatedPost );
        }

        public override async Task Delete( int id )
        {
            Post post = await _repository.GetByIdAsyncThrow( id );

            if ( !await CanUserDeletePostAsync( UserId, id ) )
            {
                throw new ValidationException( "Недостаточно прав для удаления поста" );
            }
            await base.Delete( id );
        }

        protected override async Task ExistEntities( Post post )
        {
            await _fandomService.GetById( post.FandomId );
            await _userService.GetById( post.UserId );
            await _categoryService.GetById( post.CategoryId );
        }
    }
}
