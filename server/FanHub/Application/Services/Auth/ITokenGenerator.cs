using Domain.Enums;

namespace Application.Services.Auth
{
    public interface ITokenGenerator
    {
        public Token GenerateToken( int userId, UserRole role );
    }
}
