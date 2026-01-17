namespace Application.Tools
{
    public interface IImageTools
    {
        Task<string> SaveImageAsync( IFile image );
        byte[] GetImage( string imageName );
        Task DeleteImageAsync( string imageUrl );
        Task<bool> TryDeleteImageAsync( string imagePath );
    }
}