using Application.Dto.FandomDto;
using Application.Services.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Extensions;

namespace WebApi.Controllers;

[Route( "/api/fandoms" )]
[ApiController]
public class FandomController : ControllerBase
{
    private IFandomService _fandomService;
    private IMapper _mapper;

    public FandomController( IFandomService fandomService, IMapper mapper )
    {
        _fandomService = fandomService;
        _mapper = mapper;
    }

    [HttpGet( "name" )]
    public async Task<ActionResult<List<FandomStatsDto>>> SearchFandomsByName(
        [FromQuery] string name )
    {
        IReadOnlyList<FandomStatsDto> fandoms = await _fandomService.SearchByNameAsync( name );

        return Ok( fandoms );
    }

    [HttpGet( "search/{gameId}" )]
    public async Task<ActionResult<List<FandomStatsDto>>> SearchFandomsByNameAndGame(
        [FromRoute] int gameId,
        [FromQuery] string? name = null )
    {
        IReadOnlyList<FandomStatsDto> fandoms = await _fandomService.SearchByNameAndGameIdAsync( name ?? "", gameId );

        return Ok( fandoms );
    }

    [HttpGet( "popular" )]
    public async Task<ActionResult<List<FandomReadDto>>> GetPopularFandoms(
       [FromQuery] int limit = 20 )
    {
        List<FandomReadDto> posts = await _fandomService.GetPopularAsync( limit );

        return Ok( posts );
    }

    [HttpGet( "search/{gameId}/popular" )]
    public async Task<ActionResult<List<FandomReadDto>>> GetPopularFandomsByGame(
       [FromRoute] int gameId,
       [FromQuery] int? limit = null )
    {
        List<FandomReadDto> fandoms = await _fandomService.GetPopularByGameAsync( gameId, limit );

        return Ok( fandoms );
    }

    [HttpGet]
    public async Task<ActionResult<List<FandomReadDto>>> GetFandoms()
    {
        IReadOnlyList<FandomReadDto> fandoms = await _fandomService.GetAll();

        return Ok( fandoms );
    }

    [HttpGet( "{id}" )]
    public async Task<ActionResult<FandomReadDto>> GetFandomById( int id )
    {
        FandomReadDto Fandom = await _fandomService.GetById( id );

        return Ok( Fandom );
    }

    [HttpGet( "stats/{id}" )]
    public async Task<ActionResult<FandomStatsDto>> GetFandomWithStatsById( int id )
    {
        FandomStatsDto Fandom = await _fandomService.GetFandomWithStatsById( id );

        return Ok( Fandom );
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<int>> CreateFandom( [FromBody] WebApi.Contracts.FandomDto.FandomCreateDto dto )
    {
        int creatorId = this.GetCurrentUserId();
        FandomCreateDto createDto = _mapper.Map<FandomCreateDto>( dto );
        createDto.CreatorId = creatorId;

        int id = await _fandomService.Create( createDto );

        return Ok( id );
    }

    [Authorize]
    [HttpGet( "{fandomId}/is-creator" )]
    public async Task<ActionResult<bool>> CheckCreatorOfFandom( int fandomId )
    {
        int creatorId = this.GetCurrentUserId();

        bool isCreator = await _fandomService.CheckCreator( creatorId, fandomId );

        return Ok( isCreator );
    }

    [Authorize]
    [HttpPut( "{id}" )]
    public async Task<IActionResult> UpdateFandom( int id, [FromBody] FandomUpdateDto dto )
    {
        await _fandomService.Update( id, dto );

        return Ok();
    }

    [Authorize( Policy = "AdminOnly" )]
    [HttpDelete( "{id}" )]
    public async Task<IActionResult> DeleteFandom( int id )
    {
        await _fandomService.DeleteAsync( id );

        return Ok();
    }
}
