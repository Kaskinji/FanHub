using Application.Tools;

namespace WebApi.Adapters
{
    public class FormFileAdapter : IFile
    {
        private IFormFile _formFile;

        public FormFileAdapter( IFormFile formFile )
        {
            _formFile = formFile;
        }

        public string FileName => _formFile.FileName;
        public long Length => _formFile.Length;
        public Stream OpenReadStream() => _formFile.OpenReadStream();
    }
}
