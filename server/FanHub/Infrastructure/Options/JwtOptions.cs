namespace Application.Options
{
    public class JwtOptions
    {
        public int TokenValidityInMinutes { get; init; }
        public string Secret { get; init; } = null!;
    }
}
