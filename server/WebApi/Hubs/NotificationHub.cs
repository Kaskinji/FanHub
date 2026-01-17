using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace WebApi.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            string? userId = Context.User?.FindFirst( ClaimTypes.NameIdentifier )?.Value;

            if ( userId is not null )
            {
                await Groups.AddToGroupAsync( Context.ConnectionId, $"user_{userId}" );
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync( Exception? exception )
        {
            string? userId = Context.User?.FindFirst( ClaimTypes.NameIdentifier )?.Value;

            if ( userId is not null )
            {
                await Groups.RemoveFromGroupAsync( Context.ConnectionId, $"user_{userId}" );
            }

            await base.OnDisconnectedAsync( exception );
        }
    }
}

