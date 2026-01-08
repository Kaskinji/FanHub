using Application.Options;
using Application.Tools;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Tools
{
    public class ImageTools( IOptions<FileToolsOptions> fileToolsOptions, ILogger<ImageTools> logger ) : IImageTools
    {
        public async Task<string> SaveImageAsync( IFile file )
        {
            if ( file is null || file.Length == 0 )
            {
                throw new ArgumentException( "File is null" );
            }

            try
            {
                string folderPath = Path.GetFullPath( fileToolsOptions.Value.StorageUrl );
                string fileName = Guid.NewGuid() + Path.GetExtension( file.FileName );
                string filePath = Path.Combine( folderPath, fileName );

                if ( !Directory.Exists( folderPath ) )
                {
                    Directory.CreateDirectory( folderPath );
                }

                using ( FileStream stream = new FileStream( filePath, FileMode.Create ) )
                {
                    await file.OpenReadStream().CopyToAsync( stream );
                }

                return $"/images/{fileName}";
            }
            catch ( Exception ex )
            {
                logger.LogError( ex, "IMAGE UPLOAD FAILED" );
                throw new ArgumentException( "Failed to upload image" );
            }
        }

        public byte[] GetImage( string imageName )
        {
            if ( string.IsNullOrEmpty( imageName ) )
            {
                throw new ArgumentException( "Image name is empty." );
            }

            string fileName = Path.GetFileName( imageName );

            string folderPath = Path.GetFullPath( fileToolsOptions.Value.StorageUrl );
            string filePath = Path.Combine( folderPath, fileName );

            if ( File.Exists( filePath ) )
            {
                return File.ReadAllBytes( filePath );
            }

            throw new KeyNotFoundException( $"Image '{fileName}' not found." );
        }

        public async Task DeleteImageAsync( string imageUrl )
        {
            if ( string.IsNullOrEmpty( imageUrl ) )
            {
                throw new ArgumentException( "Image URL is empty." );
            }

            string fileName = Path.GetFileName( imageUrl );

            if ( !imageUrl.StartsWith( "/images/" ) )
            {
                logger.LogWarning( "Image URL doesn't start with /images/: {ImageUrl}", imageUrl );
            }

            string folderPath = Path.GetFullPath( fileToolsOptions.Value.StorageUrl );
            string filePath = Path.Combine( folderPath, fileName );

            bool exists = await Task.Run( () => File.Exists( filePath ) );

            if ( !exists )
            {
                logger.LogWarning( "Image not found for deletion: {FilePath}", filePath );
                throw new FileNotFoundException( $"Image '{fileName}' not found at path: {filePath}" );
            }

            try
            {
                await Task.Run( () => File.Delete( filePath ) );
                logger.LogInformation( "Image deleted: {FilePath}", filePath );
            }
            catch ( IOException ex ) when ( ex is DirectoryNotFoundException or FileNotFoundException )
            {
                logger.LogTrace( "Image already deleted: {FilePath}", filePath );
                throw new FileNotFoundException( $"Image '{fileName}' not found", ex );
            }
            catch ( IOException ex )
            {
                logger.LogError( ex, "IO error when deleting image: {FilePath}", filePath );
                throw;
            }
        }

        public async Task<bool> TryDeleteImageAsync( string imagePath )
        {
            try
            {
                await DeleteImageAsync( imagePath );
                return true;
            }
            catch ( Exception ex )
            {
                logger.LogWarning( ex, "Failed to delete image {ImagePath}", imagePath );
                return false;
            }
        }
    }
}