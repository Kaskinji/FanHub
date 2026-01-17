using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Extensions
{
    public static class ControllerExtensions
    {
        public static int GetCurrentUserId( this ControllerBase controller )
        {
            Claim? userClaim = controller.User.FindFirst( ClaimTypes.NameIdentifier );
            int id = int.Parse( userClaim!.Value );

            return id;
        }
    }
}
