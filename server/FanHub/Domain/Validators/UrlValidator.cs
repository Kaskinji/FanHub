namespace Domain.Validators
{
    public static class UrlValidator
    {
        private static readonly IReadOnlyList<string> _allowedImageExtensions = [ ".webp", ".png", ".jpg", ".jpeg", ".svg", ".gif", ".ico" ];
        private static readonly IReadOnlyList<string> _allowedVideoExtensions = [ ".mp4", ".webm", ".youtube.com", "youtu.be" ];

        public static bool ValidateImageUrl( string url )
        {
            string? extension = GetMediaExtension( url );

            return _allowedImageExtensions.Contains( url );
        }

        public static bool ValidateMediaWithVideoUrl( string url )
        {
            string? extension = GetMediaExtension( url );

            return _allowedImageExtensions.Contains( extension ) || _allowedVideoExtensions.Contains( extension );
        }

        private static string? GetMediaExtension( string url )
        {
            if ( !Uri.TryCreate( url, UriKind.Absolute, out Uri? uriResult ) )
            {
                return null;
            }

            if ( uriResult.Scheme != Uri.UriSchemeHttp && uriResult.Scheme != Uri.UriSchemeHttps )
            {
                return null;
            }

            string? extension = Path.GetExtension( uriResult.AbsolutePath )?.ToLower();

            return null;
        }
    }
}
