using Application.Dto.FandomDto;
using Application.Services.Interfaces;
using Domain.Foundations;
using Microsoft.AspNetCore.Mvc;

namespace FanHub.Controllers;

[Route( "/api/fandoms" )]
[ApiController]
public class FandomController : ControllerBase
{
    private IFandomService _fandomService;
    private IUnitOfWork _unitOfWork;

    public FandomController( IFandomService fandomService, IUnitOfWork unitOfWork )
    {
        _fandomService = fandomService;
        _unitOfWork = unitOfWork;
    }

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

    [HttpPost]
    public async Task<ActionResult<int>> CreateFandom( [FromBody] FandomCreateDto dto )
    {
        int id = await _fandomService.Create( dto );

        await _unitOfWork.CommitAsync();

        return Ok( id );
    }

    [HttpPut( "{id}" )]
    public async Task<IActionResult> UpdateFandom( int id, [FromBody] FandomUpdateDto dto ) // todo: поменять dto(убрать опциональные поля)
    {
        await _fandomService.Update( id, dto );

        await _unitOfWork.CommitAsync();

        return Ok();
    }

    [HttpDelete( "{id}" )]
    public async Task<IActionResult> DeleteFandom( int id )
    {
        await _fandomService.DeleteAsync( id );

        await _unitOfWork.CommitAsync();

        return Ok();
    }
}
