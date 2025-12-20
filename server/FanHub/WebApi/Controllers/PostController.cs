using Application.Dto.PostDto;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route( "/api/posts" )]
    [ApiController]
    public class PostController : ControllerBase
    {
        private IPostService _postService;

        public PostController( IPostService postService )
        {
            _postService = postService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<PostReadDto>>> GetPosts()
        {
            IReadOnlyList<PostReadDto> posts = await _postService.GetAll();

            return Ok( posts );
        }

        [Authorize]
        [HttpGet( "category/name" )]
        public async Task<ActionResult<List<PostReadDto>>> GetPostsByCategoryName(
        [FromQuery] string categoryName )
        {
            List<PostReadDto> posts = await _postService.SearchByCategoryNameAsync( categoryName );

            return Ok( posts );
        }

        [Authorize]
        [HttpGet( "category/{categoryId}" )]
        public async Task<ActionResult<List<PostReadDto>>> GetPostsByCategoryId(
        [FromRoute] int categoryId )
        {
            List<PostReadDto> posts = await _postService.SearchByCategoryIdAsync( categoryId );

            return Ok( posts );
        }

        [Authorize]
        [HttpGet( "search" )]
        public async Task<ActionResult<List<PostReadDto>>> SearchPosts(
        [FromRoute] int? categoryId = null,
        [FromQuery] string? categoryName = null )
        {
            List<PostReadDto> posts = await _postService.SearchByCategoryAsync( categoryName, categoryId );

            return Ok( posts );
        }

        [Authorize]
        [HttpGet( "{id}" )]
        public async Task<ActionResult<PostReadDto>> GetPostById( int id )
        {
            PostReadDto post = await _postService.GetById( id );

            return Ok( post );
        }

        [HttpGet( "popular" )]
        public async Task<ActionResult<List<PostReadDto>>> GetPopularPosts(
       [FromQuery] int limit = 20 )
        {
            List<PostReadDto> posts = await _postService.GetPopularPosts( limit );

            return Ok( posts );
        }

        [HttpGet( "fandom/{fandomId}/popular" )]
        public async Task<ActionResult<List<PostReadDto>>> GetPopularPostsByFandom(
       [FromRoute] int fandomId,
       [FromQuery] int limit = 20 )
        {
            List<PostReadDto> posts = await _postService.GetPopularPostsByFandom( fandomId, limit );

            return Ok( posts );
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<int>> CreatePost( [FromBody] PostCreateDto dto )
        {
            int id = await _postService.Create( dto );

            return Ok( id );
        }

        [Authorize]
        [HttpPut( "{id}" )]
        public async Task<IActionResult> UpdatePost( int id, [FromBody] PostUpdateDto dto )
        {
            await _postService.Update( id, dto );

            return Ok();
        }

        [Authorize]
        [HttpDelete( "{id}" )]
        public async Task<IActionResult> DeletePost( int id )
        {
            await _postService.DeleteAsync( id );

            return Ok();
        }
    }
}
