using Application.Dto.PostDto;
using Application.Services.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Extensions;

namespace WebApi.Controllers
{
    [Route( "/api/posts" )]
    [ApiController]
    public class PostController : ControllerBase
    {
        private IPostService _postService;
        private IMapper _mapper;

        public PostController( IPostService postService, IMapper mapper )
        {
            _postService = postService;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<PostReadDto>>> GetPosts()
        {
            IReadOnlyList<PostReadDto> posts = await _postService.GetAll();

            return Ok( posts );
        }

        [HttpGet( "category/name" )]
        public async Task<ActionResult<List<PostStatsDto>>> GetPostsByCategoryName(
        [FromQuery] string categoryName )
        {
            List<PostStatsDto> posts = await _postService.SearchByCategoryNameAsync( categoryName );

            return Ok( posts );
        }

        [HttpGet( "category/{categoryId}" )]
        public async Task<ActionResult<List<PostStatsDto>>> GetPostsByCategoryId(
        [FromRoute] int categoryId )
        {
            List<PostStatsDto> posts = await _postService.SearchByCategoryIdAsync( categoryId );

            return Ok( posts );
        }

        [HttpGet( "search" )]
        public async Task<ActionResult<List<PostStatsDto>>> SearchPosts(
        [FromRoute] int? categoryId = null,
        [FromQuery] string? categoryName = null )
        {
            List<PostStatsDto> posts = await _postService.SearchByCategoryAsync( categoryName, categoryId );

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
        [HttpGet( "with-stats/{id}" )]
        public async Task<ActionResult<PostStatsDto>> GetPostWithStatsById( int id )
        {
            PostStatsDto post = await _postService.GetPostWithStatsById( id );

            return Ok( post );
        }

        [HttpGet( "popular" )]
        public async Task<ActionResult<List<PostStatsDto>>> GetPopularPosts(
       [FromQuery] int? limit = null )
        {
            List<PostStatsDto> posts = await _postService.GetPopularPosts( limit );

            return Ok( posts );
        }

        [HttpGet( "fandom/{fandomId}/popular" )]
        public async Task<ActionResult<List<PostStatsDto>>> GetPopularPostsByFandom(
       [FromRoute] int fandomId,
       [FromQuery] int? limit = null )
        {
            List<PostStatsDto> posts = await _postService.GetPopularPostsByFandom( fandomId, limit );

            return Ok( posts );
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<int>> CreatePost( [FromBody] WebApi.Contracts.PostDto.PostCreateDto dto )
        {
            PostCreateDto createDto = _mapper.Map<PostCreateDto>( dto );

            createDto.UserId = this.GetCurrentUserId();

            int id = await _postService.Create( createDto );

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
