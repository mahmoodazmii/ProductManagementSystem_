using System.Linq;
using System.Web.Mvc;
using ProductManagementSystem_.Models;

namespace ProductManagementSystem_.Controllers
{
    public class CityController : Controller
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
                .Where(x => x.Status)
                .OrderBy(x => x.CountryName)
                .Select(x => new
                {
                    x.CountryId,
                    x.CountryName
                }).ToList();

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetStates(int countryId)
        {
            var data = db.States
                .Where(x => x.CountryId == countryId && x.Status)
                .OrderBy(x => x.StateName)
                .Select(x => new
                {
                    x.StateId,
                    x.StateName
                }).ToList();

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetCities()
        {
            var data = db.Cities
                .Select(x => new
                {
                    x.CityId,
                    x.CityName,
                    x.StateId,
                    StateName = x.State.StateName,
                    CountryName = x.State.Country.CountryName,
                    Status = x.Status ? "Active" : "Inactive"
                })
                .OrderBy(x => x.CountryName)
                .ThenBy(x => x.StateName)
                .ThenBy(x => x.CityName)
                .ToList();

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveCity(City model)
        {
            if (ModelState.IsValid)
            {
                if (model.CityId == 0)
                {
                    db.Cities.Add(model);
                }
                else
                {
                    var city = db.Cities.Find(model.CityId);

                    if (city != null)
                    {
                        city.StateId = model.StateId;
                        city.CityName = model.CityName;
                        city.Status = model.Status;
                    }
                }

                db.SaveChanges();

                return Json(new
                {
                    success = true,
                    message = "City saved successfully."
                });
            }

            return Json(new
            {
                success = false,
                message = "Invalid Data."
            });
        }

        [HttpGet]
        public JsonResult EditCity(int id)
        {
            var data = db.Cities
                .Where(x => x.CityId == id)
                .Select(x => new
                {
                    x.CityId,
                    x.CityName,
                    x.StateId,
                    CountryId = x.State.CountryId,
                    x.Status
                })
                .FirstOrDefault();

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteCity(int id)
        {
            var city = db.Cities.Find(id);

            if (city != null)
            {
                db.Cities.Remove(city);

                db.SaveChanges();

                return Json(new
                {
                    success = true,
                    message = "City deleted successfully."
                });
            }

            return Json(new
            {
                success = false,
                message = "City not found."
            });
        }
    }
}