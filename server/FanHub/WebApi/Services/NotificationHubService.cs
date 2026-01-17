using Application.Dto.NotificationDto;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using WebApi.Hubs;

namespace WebApi.Services
{
    public class NotificationHubService : INotificationHubService
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationHubService( IHubContext<NotificationHub> hubContext )
        {
            _hubContext = hubContext;
        }

        public async Task SendNotificationToUserAsync( int userId, FandomNotificationReadDto notification )
        {
            await _hubContext.Clients.Group( $"user_{userId}" ).SendAsync( "ReceiveNotification", notification );
        }

        public async Task SendNotificationToUsersAsync( List<int> userIds, FandomNotificationReadDto notification )
        {
            List<string> groupNames = userIds.Select( userId => $"user_{userId}" ).ToList();
            await _hubContext.Clients.Groups( groupNames ).SendAsync( "ReceiveNotification", notification );
        }
    }
}

