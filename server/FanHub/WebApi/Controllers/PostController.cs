using Application.Dto.FandomDto;
using Application.Dto.PostDto;
using Application.Services;
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
        [HttpGet( "search/category/name" )]
        public async Task<ActionResult<List<PostReadDto>>> GetPostsByCategoryName(
        [FromQuery] string categoryName )
        {
            if ( string.IsNullOrWhiteSpace( categoryName ) )
            {
                return BadRequest( "Category name is required" );
            }

            List<PostReadDto> posts = await _postService.SearchByCategoryNameAsync( categoryName );
            return Ok( posts );
        }

        [Authorize]
        [HttpGet( "search/category/{categoryId}" )]
        public async Task<ActionResult<List<PostReadDto>>> GetPostsByCategoryId(
        [FromRoute] int categoryId )
        {
            List<PostReadDto> posts = await _postService.SearchByCategoryIdAsync( categoryId );
            return Ok( posts );
        }

        [Authorize]
        [HttpGet( "search" )]
        public async Task<ActionResult<List<PostReadDto>>> SearchPosts(
        [FromQuery] int? categoryId = null,
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
