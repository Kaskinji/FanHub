using Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Contracts.NotificationViewedDto;
using WebApi.Extensions;

namespace WebApi.Controllers
{
    [Route( "/api/notifications/viewed" )]
    [ApiController]
    public class NotificationViewedController : ControllerBase
    {
        private readonly INotificationViewedService _notificationViewedService;

        public NotificationViewedController( INotificationViewedService notificationViewedService )
        {
            _notificationViewedService = notificationViewedService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<Application.Dto.NotificationViewedDto.NotificationViewedReadDto>>> GetViewedNotifications( [FromQuery] bool? isHidden = null )
        {
            int userId = this.GetCurrentUserId();
            List<Application.Dto.NotificationViewedDto.NotificationViewedReadDto> notifications = await _notificationViewedService
                .GetViewedNotificationsByUserIdAsync( userId, isHidden );
            return Ok( notifications );
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> MarkNotificationsAsViewed( [FromBody] NotificationViewedMarkDto dto )
        {
            int userId = this.GetCurrentUserId();
            await _notificationViewedService.MarkNotificationsAsViewedAsync( userId, dto.NotificationIds );
            return Ok();
        }

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> UnmarkNotificationsAsViewed( [FromBody] NotificationViewedMarkDto dto )
        {
            int userId = this.GetCurrentUserId();
            await _notificationViewedService.UnmarkNotificationsAsViewedAsync( userId, dto.NotificationIds );
            return Ok();
        }

        [Authorize]
        [HttpPost( "hide" )]
        public async Task<IActionResult> HideNotifications( [FromBody] NotificationViewedMarkDto dto )
        {
            int userId = this.GetCurrentUserId();
            await _notificationViewedService.HideNotificationsAsync( userId, dto.NotificationIds );
            return Ok();
        }

        [Authorize]
        [HttpPost( "unhide" )]
        public async Task<IActionResult> UnhideNotifications( [FromBody] NotificationViewedMarkDto dto )
        {
            int userId = this.GetCurrentUserId();
            await _notificationViewedService.UnhideNotificationsAsync( userId, dto.NotificationIds );
            return Ok();
        }

        [Authorize]
        [HttpGet( "with-viewed" )]
        public async Task<ActionResult<List<Application.Dto.NotificationViewedDto.NotificationWithViewedDto>>> GetNotificationsWithViewed( [FromQuery] bool? isHidden = null )
        {
            int userId = this.GetCurrentUserId();
            List<Application.Dto.NotificationViewedDto.NotificationWithViewedDto> notifications = await _notificationViewedService
                .GetNotificationsWithViewedAsync( userId, isHidden );
            return Ok( notifications );
        }

        [Authorize]
        [HttpGet( "with-viewed/{notificationId}" )]
        public async Task<ActionResult<Application.Dto.NotificationViewedDto.NotificationWithViewedDto>> GetNotificationWithViewed( int notificationId )
        {
            int userId = this.GetCurrentUserId();
            Application.Dto.NotificationViewedDto.NotificationWithViewedDto? notification = await _notificationViewedService
                .GetNotificationWithViewedAsync( userId, notificationId );

            if ( notification is null )
            {
                return NotFound();
            }

            return Ok( notification );
        }
    }
}

