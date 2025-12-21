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

                return fileName;
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

            string folderPath = Path.GetFullPath( fileToolsOptions.Value.StorageUrl );
            string filePath = Path.Combine( folderPath, imageName );

            if ( File.Exists( filePath ) )
            {
                byte[] imageBytes = File.ReadAllBytes( filePath );
                return imageBytes;
            }
            else
            {
                throw new KeyNotFoundException( "Image is not found." );
            }
        }

        public void DeleteImage( string imageName )
        {
            if ( string.IsNullOrEmpty( imageName ) )
            {
                throw new ArgumentException( "Image name is empty." );
            }

            string currentDirectory = Directory.GetCurrentDirectory();
            string folderPath = Path.Combine( currentDirectory, fileToolsOptions.Value.StorageUrl );
            string filePath = Path.Combine( folderPath, imageName );

            if ( File.Exists( filePath ) )
            {
                File.Delete( filePath );
            }
            else
            {
                throw new KeyNotFoundException( "Image is not found." );
            }
        }
    }
}
