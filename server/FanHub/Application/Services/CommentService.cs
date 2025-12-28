using Application.Services.Interfaces;
using Application.Dto.CommentDto;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using FluentValidation;
using Domain.Extensions;
using Microsoft.Extensions.Logging;
using Domain.Foundations;

namespace Application.Services
{
    public class CommentService : BaseService<Comment, CommentCreateDto, CommentReadDto, CommentUpdateDto>, ICommentService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPostRepository _postRepository;
        private readonly ICommentRepository _commentRepository;
        public CommentService( ICommentRepository repository,
            IUserRepository userRepository,
            IPostRepository postRepository,
            IMapper mapper,
            IValidator<Comment> validator,
            ILogger<CommentService> logger,
            IUnitOfWork unitOfWork )

        : base( repository, mapper, validator, logger, unitOfWork )
        {
            _userRepository = userRepository;
            _postRepository = postRepository;
            _commentRepository = repository;
        }

        public async Task<List<CommentShowDto>> GetCommentsAsync()
        {
            List<Comment> comments = await _commentRepository.GetCommentsAsync();

            return _mapper.Map<List<CommentShowDto>>( comments );
        }
        public async Task<List<CommentShowDto>> GetCommentsByPostIdAsync( int postId )
        {
            List<Comment> comments = await _commentRepository.GetCommentsByPostIdAsync( postId );

            return _mapper.Map<List<CommentShowDto>>( comments );
        }
        protected override Comment InitializeEntity( CommentCreateDto dto )
        {
            Comment entity = new();

            entity.CommentDate = DateTime.UtcNow;

            return entity;
        }
        protected override async Task ExistEntities( Comment entity )
        {
            await _postRepository.GetByIdAsyncThrow( entity.PostId );

            await _userRepository.GetByIdAsyncThrow( entity.UserId );
        }
    }
}
