using ProductManagementSystem_.Models;
using System.Linq;
using System.Web.Mvc;

namespace ProductManagementSystem_.Controllers
{
    public class CountryController : Controller
    {
        ProductDbContext db = new ProductDbContext();

        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetCountries()
        {
            var data = db.Countries
                .Where(x => x.Status == true)
                .OrderBy(x => x.CountryName)
                .Select(x => new
                {
                    x.CountryId,
                    x.CountryName,
                    Status = x.Status ? "Active" : "Inactive"
                })
                .ToList();

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveCountry(Country model)
        {
            if (ModelState.IsValid)
            {
                if (model.CountryId == 0)
                {
                    db.Countries.Add(model);
                }
                else
                {
                    var country = db.Countries.Find(model.CountryId);

                    if (country != null)
                    {
                        country.CountryName = model.CountryName;
                        country.Status = model.Status;
                    }
                }

                db.SaveChanges();

                return Json(new
                {
                    success = true,
                    message = "Country saved successfully."
                });
            }

            return Json(new
            {
                success = false,
                message = "Invalid data."
            });
        }

        [HttpGet]
        public JsonResult EditCountry(int id)
        {
            var country = db.Countries
                .Where(x => x.CountryId == id)
                .Select(x => new
                {
                    x.CountryId,
                    x.CountryName,
                    x.Status
                })
                .FirstOrDefault();

            return Json(country, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteCountry(int id)
        {
            var country = db.Countries.Find(id);

            if (country != null)
            {
                db.Countries.Remove(country);
                db.SaveChanges();

                return Json(new
                {
                    success = true,
                    message = "Country deleted successfully."
                });
            }

            return Json(new
            {
                success = false,
                message = "Country not found."
            });
        }
    }
}