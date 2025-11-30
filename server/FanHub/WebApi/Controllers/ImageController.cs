using System.Diagnostics.CodeAnalysis;
using Application.Tools;
using Infrastructure.Tools;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Adapters;

namespace WebApi.Controllers
{
    [ApiController]
    [Route( "api/images" )]
    public class ImageController : ControllerBase
    {
        private IImageTools _imageHelperTools;

        public ImageController( IImageTools imageHelperTools )
        {
            _imageHelperTools = imageHelperTools;
        }

        [Authorize]
        [HttpPost( "upload" )]
        public async Task<ActionResult<string>> UploadImage(
            [NotNull] IFormFile image )
        {
            IFile file = new FormFileAdapter( image );
            string result = await _imageHelperTools.SaveImageAsync( file );

            return Ok( result );
        }

        [HttpGet( "{fileName}" )]
        public ActionResult<byte[]> GetImage(
            [FromRoute] string fileName )
        {
            byte[] result = _imageHelperTools.GetImage( fileName );

            return File( result, "image/jpeg" );
        }

        [Authorize]
        [HttpDelete( "{fileName}" )]
        public IActionResult DeleteImage(
            [FromRoute] string fileName )
        {
            _imageHelperTools.DeleteImage( fileName );

            return Ok();
        }
    }
}
