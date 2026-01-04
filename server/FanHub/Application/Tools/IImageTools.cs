namespace Application.Tools
{
    public interface IImageTools
    {
        Task<string> SaveImageAsync( IFile image );
        byte[] GetImage( string imageName );
        void DeleteImage( string imageUrl );
    }
}