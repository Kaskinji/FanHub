namespace Application.PasswordHasher
{
    public interface IPasswordHasher
    {
        string GeneratePasswordHash( string password );
        bool VerifyPassword( string password, string passwordHash );
    }
}
