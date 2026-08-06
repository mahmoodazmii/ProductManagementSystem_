using System.Web.Mvc;
using ProductManagementSystem_.Filters;

namespace ProductManagementSystem_
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            // Handle application errors
            filters.Add(new HandleErrorAttribute());

            // Custom Session Authorization
            filters.Add(new SessionAuthorizeAttribute());
        }
    }
}