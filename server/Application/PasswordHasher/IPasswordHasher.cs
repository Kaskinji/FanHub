namespace Application.PasswordHasher
{
    public interface IPasswordHasher
    {
        string Hash( string password );
        bool VerifyPassword( string password, string passwordHash );
    }
}
