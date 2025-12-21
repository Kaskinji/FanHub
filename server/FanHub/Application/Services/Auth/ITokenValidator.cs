namespace Application.Services.Auth
{
    public interface ITokenValidator
    {
        Task<bool> ValidateTokenAsync( string token );
    }
}
