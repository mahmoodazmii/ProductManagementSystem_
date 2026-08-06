using ProductManagementSystem_.Filters;
using ProductManagementSystem_.Models;
using ProductManagementSystem_.ViewModels;
using System;
using System.Linq;
using System.Web.Mvc;

namespace ProductManagementSystem_.Controllers
{
    [SessionAuthorize]
    public class DashboardController : Controller
    {
        private readonly ProductDbContext db = new ProductDbContext();

        public ActionResult Index()
        {
            try
            {
                DashboardViewModel vm = new DashboardViewModel
                {

                    TotalCategories = db.Categories.Count(),
                    TotalCompanies = db.Companies.Count(),
                    TotalProducts = db.Products.Count(),
                    RecentProducts = db.Products
                        .OrderByDescending(p => p.ProductId)
                        .Take(8)
                        .Select(p => new RecentProductItem
                        {
                            ProductId = p.ProductId,
                            ProductName = p.ProductName,
                            Category = p.Category != null ? p.Category.CategoryName : "",
                            Company = p.Company != null ? p.Company.CompanyName : "",
                            SalePrice = p.SalePrice
                        })
                        .ToList(),

                    RecentCategories = db.Categories
                        .OrderByDescending(c => c.CategoryId)
                        .Take(6)
                        .Select(c => c.CategoryName)
                        .ToList(),

                    RecentCompanies = db.Companies
                        .OrderByDescending(c => c.CompanyId)
                        .Take(6)
                        .Select(c => c.CompanyName)
                        .ToList()
                };

                ViewBag.FullName = Session["FullName"];
                ViewBag.UserName = Session["UserName"];

                return View(vm);
            }
            catch (Exception ex)
            {

                TempData["Error"] = ex.Message;
                return View(new DashboardViewModel());
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }

            base.Dispose(disposing);
        }
    }
}