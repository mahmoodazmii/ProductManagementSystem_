using System.Linq;
using System.Web.Mvc;
using ProductManagementSystem_.Models;

namespace ProductManagementSystem_.Controllers
{
    public class StateController : Controller
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
        public JsonResult GetStates()
        {
            var data = db.States
                .Select(x => new
                {
                    x.StateId,
                    x.StateName,
                    CountryName = x.Country.CountryName,
                    x.CountryId,
                    Status = x.Status ? "Active" : "Inactive"
                })
                .OrderBy(x => x.CountryName)
                .ThenBy(x => x.StateName)
                .ToList();

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveState(State model)
        {
            if (ModelState.IsValid)
            {
                if (model.StateId == 0)
                {
                    db.States.Add(model);
                }
                else
                {
                    var state = db.States.Find(model.StateId);

                    if (state != null)
                    {
                        state.CountryId = model.CountryId;
                        state.StateName = model.StateName;
                        state.Status = model.Status;
                    }
                }

                db.SaveChanges();

                return Json(new
                {
                    success = true,
                    message = "State saved successfully."
                });
            }

            return Json(new
            {
                success = false,
                message = "Invalid Data."
            });
        }

        [HttpGet]
        public JsonResult EditState(int id)
        {
            var data = db.States
                .Where(x => x.StateId == id)
                .Select(x => new
                {
                    x.StateId,
                    x.CountryId,
                    x.StateName,
                    x.Status
                })
                .FirstOrDefault();

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteState(int id)
        {
            var state = db.States.Find(id);

            if (state != null)
            {
                db.States.Remove(state);
                db.SaveChanges();

                return Json(new
                {
                    success = true,
                    message = "State deleted successfully."
                });
            }

            return Json(new
            {
                success = false,
                message = "State not found."
            });
        }
    }
}