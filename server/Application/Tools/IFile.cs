namespace Application.Tools
{
    public interface IFile
    {
        string FileName { get; }
        long Length { get; }
        Stream OpenReadStream();
    }
}
