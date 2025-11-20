using Application.Dto.PostDto;
using Application.Services.Interfaces;
using Domain.Foundations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Controllers.Attributes;

namespace WebApi.Controllers
{
    [Route( "/api/posts" )]
    [ApiController]
    public class PostController : ControllerBase
    {
        private IPostService _postService;
        private IUnitOfWork _unitOfWork;

        public PostController( IPostService postService, IUnitOfWork unitOfWork )
        {
            _postService = postService;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult<List<PostReadDto>>> GetPosts()
        {
            IReadOnlyList<PostReadDto> posts = await _postService.GetAll();

            return Ok( posts );
        }

        [HttpGet( "{id}" )]
        public async Task<ActionResult<PostReadDto>> GetPostById( int id )
        {
            PostReadDto post = await _postService.GetById( id );

            return Ok( post );
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<int>> CreatePost( [FromBody] PostCreateDto dto )
        {
            int id = await _postService.Create( dto );

            await _unitOfWork.CommitAsync();

            return Ok( id );
        }

        [Authorize]
        [HttpPut( "{id}" )]
        public async Task<IActionResult> UpdatePost( int id, [FromBody] PostUpdateDto dto )
        {
            await _postService.Update( id, dto );

            await _unitOfWork.CommitAsync();

            return Ok();
        }

        [Authorize]
        [HttpDelete( "{id}" )]
        public async Task<IActionResult> DeletePost( int id )
        {
            await _postService.DeleteAsync( id );

            await _unitOfWork.CommitAsync();

            return Ok();
        }
    }
}
