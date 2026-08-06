using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace ProductManagementSystem_.Filters
{
    public class SessionAuthorizeAttribute : AuthorizeAttribute
    {
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (httpContext == null)
            {
                return false;
            }


            var routeData = httpContext
                .Request
                .RequestContext
                .RouteData;


            string controller =
                routeData.Values["controller"] != null
                ? routeData.Values["controller"].ToString()
                : "";



            string action =
                routeData.Values["action"] != null
                ? routeData.Values["action"].ToString() : "";

            if (controller.Equals("Account"))
            {
                if (action.Equals("Login") ||
                    action.Equals("Register"))
                {
                    return true;
                }
            }

            if (httpContext.Session != null &&
                httpContext.Session["UserId"] != null)
            {
                return true;
            }

            return false;
        }
        protected override void HandleUnauthorizedRequest(
            AuthorizationContext filterContext)
        {

            string returnUrl =filterContext.HttpContext.Request.RawUrl;

            filterContext.Result =
                new RedirectToRouteResult(
                    new RouteValueDictionary
                    {
                        {
                            "controller",
                            "Account"
                        },
                        {
                            "action",
                            "Login"
                        },
                        {
                            "ReturnUrl",
                            returnUrl
                        }
                    });
        }
    }
}