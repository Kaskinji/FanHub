using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace WebApi.Controllers.Attributes
{
    public class SelfOnlyAttribute : Attribute, IActionFilter
    {
        public void OnActionExecuting( ActionExecutingContext context )
        {

        }

        public void OnActionExecuted( ActionExecutedContext context ) { }
    }

}
