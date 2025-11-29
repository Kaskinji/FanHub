using Application.Tools;

namespace Application.Services.Interfaces
{
    public interface IImageService
    {
        Task<string> SaveImageAsync( IFile image );
        byte[] GetImage( string imageName );
        void DeleteImage( string imageName );
    }
}