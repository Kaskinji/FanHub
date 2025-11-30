using Application.Dto.FandomDto;
using Application.Services.Interfaces;
using Domain.Foundations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FanHub.Controllers;

[Route( "/api/fandoms" )]
[ApiController]
public class FandomController : ControllerBase
{
    private IFandomService _fandomService;
    public FandomController( IFandomService fandomService )
    {
        _fandomService = fandomService;
    }

    // todo: добавить метод для получения подписок
    [HttpGet]
    public async Task<ActionResult<List<FandomReadDto>>> GetFandoms()
    {
        IReadOnlyList<FandomReadDto> Fandoms = await _fandomService.GetAll();

        return Ok( Fandoms );
    }

    [HttpGet( "{id}" )]
    public async Task<ActionResult<FandomReadDto>> GetFandomById( int id )
    {
        FandomReadDto Fandom = await _fandomService.GetById( id );

        return Ok( Fandom );
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<int>> CreateFandom( [FromBody] FandomCreateDto dto )
    {
        int id = await _fandomService.Create( dto );

        return Ok( id );
    }

    [Authorize]
    [HttpPut( "{id}" )]
    public async Task<IActionResult> UpdateFandom( int id, [FromBody] FandomUpdateDto dto )
    {
        await _fandomService.Update( id, dto );

        return Ok();
    }

    [Authorize]
    [HttpDelete( "{id}" )]
    public async Task<IActionResult> DeleteFandom( int id )
    {
        await _fandomService.DeleteAsync( id );

        return Ok();
    }
}
