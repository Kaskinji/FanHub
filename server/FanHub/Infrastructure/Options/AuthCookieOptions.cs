namespace WebApi.Options
{
    public class AuthCookieOptions
    {
        public string JwtCookieName { get; init; } = null!;
        public bool HttpOnly { get; init; }
        public bool Secure { get; init; }
        public string SameSite { get; init; } = null!;
        public int ExpireDays { get; init; }
    }
}
