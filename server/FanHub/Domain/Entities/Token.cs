namespace Application.Services.Auth
{
    public class Token
    {
        public Token( string value, DateTime expireDate )
        {
            Value = value;
            ExpireDate = expireDate;
        }

        public string Value { get; set; } = string.Empty;

        public DateTime ExpireDate { get; set; }
    }
}