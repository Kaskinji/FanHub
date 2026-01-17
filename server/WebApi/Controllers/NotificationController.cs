using Application.Dto.NotificationDto;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route( "/api/notifications" )]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private IFandomNotificationService _notificationService;

        public NotificationController( IFandomNotificationService NotificationService )
        {
            _notificationService = NotificationService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<FandomNotificationReadDto>>> GetNotifications()
        {
            IReadOnlyList<FandomNotificationReadDto> notifications = await _notificationService.GetAll();

            return Ok( notifications );
        }

        [Authorize]
        [HttpGet( "{id}" )]
        public async Task<ActionResult<FandomNotificationReadDto>> GetNotificationById( int id )
        {
            FandomNotificationReadDto notification = await _notificationService.GetById( id );

            return Ok( notification );
        }


        [Authorize]
        [HttpGet( "fandom/{fandomId}" )]
        public async Task<ActionResult<FandomNotificationReadDto>> GetByFandomId( int id )
        {
            List<FandomNotificationReadDto> notifications = await _notificationService.GetNotificationsByFandomIdAsync( id );

            return Ok( notifications );
        }
        [Authorize]
        [HttpDelete( "{id}" )]
        public async Task<IActionResult> DeleteById( int id )
        {
            await _notificationService.DeleteAsync( id );

            return Ok();
        }
    }
}
