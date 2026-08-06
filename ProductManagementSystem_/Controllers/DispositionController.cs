using ProductManagementSystem_.Models;
using ProductManagementSystem_.ViewModels;
using System;
using System.Linq;
using System.Web.Mvc;

namespace ProductManagementSystem_.Controllers
{
    public class DispositionController : Controller
    {
        private ProductDbContext db = new ProductDbContext();

        public ActionResult Index()
        {
            var vm = new DispositionViewModel
            {
                Disposition = new Disposition()
            };

            return View(vm);
        }

        [HttpPost]
        public JsonResult SaveDisposition(Disposition model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.DispositionName))
                    return Json(new { success = false, message = "Disposition is required." });

                if (string.IsNullOrWhiteSpace(model.ShortCode))
                    return Json(new { success = false, message = "Short Code is required." });

                if (model.DispositionId == 0)
                {
                    model.CreatedDate = DateTime.Now;
                    model.ModifiedDate = null;
                    model.IsDeleted = false;

                    db.Dispositions.Add(model);
                }
                else
                {
                    var data = db.Dispositions.FirstOrDefault(x => x.DispositionId == model.DispositionId);

                    if (data == null)
                        return Json(new { success = false, message = "Record not found." });

                    data.DispositionName = model.DispositionName;
                    data.ShortCode = model.ShortCode;
                    data.SortOrder = model.SortOrder;
                    data.DateRequired = model.DateRequired;
                    data.ModifiedDate = DateTime.Now;
                }

                db.SaveChanges();

                return Json(new
                {
                    success = true,
                    message = "Record saved successfully."
                });
            }
            catch (Exception ex)
            {
                string msg = ex.Message;

                if (ex.InnerException != null)
                    msg += " | " + ex.InnerException.Message;

                if (ex.InnerException != null && ex.InnerException.InnerException != null)
                    msg += " | " + ex.InnerException.InnerException.Message;

                return Json(new
                {
                    success = false,
                    message = msg
                });
            }
        }

        [HttpGet]
        public JsonResult GetDisposition()
        {
            try
            {
                var list = db.Dispositions
                    .Where(x => x.IsDeleted == false)
                    .OrderBy(x => x.SortOrder)
                    .ToList()
                    .Select((x, index) => new
                    {
                        SN = index + 1,
                        x.DispositionId,
                        x.DispositionName,
                        x.ShortCode,
                        x.SortOrder,
                        DateRequired = x.DateRequired ? "Yes" : "No"
                    });

                return Json(new
                {
                    success = true,
                    data = list
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string msg = ex.Message;

                if (ex.InnerException != null)
                    msg += " | " + ex.InnerException.Message;

                if (ex.InnerException != null && ex.InnerException.InnerException != null)
                    msg += " | " + ex.InnerException.InnerException.Message;

                return Json(new
                {
                    success = false,
                    message = msg
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult EditDisposition(int id)
        {
            try
            {
                var data = db.Dispositions.FirstOrDefault(x => x.DispositionId == id && !x.IsDeleted);

                if (data == null)
                    return Json(new
                    {
                        success = false,
                        message = "Record not found."
                    }, JsonRequestBehavior.AllowGet);

                return Json(new
                {
                    success = true,
                    data = data
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = ex.Message
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult DeleteDisposition(int id)
        {
            try
            {
                var data = db.Dispositions.FirstOrDefault(x => x.DispositionId == id);

                if (data == null)
                    return Json(new
                    {
                        success = false,
                        message = "Record not found."
                    });

                data.IsDeleted = true;
                data.ModifiedDate = DateTime.Now;

                db.SaveChanges();

                return Json(new
                {
                    success = true,
                    message = "Record deleted successfully."
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
    }
}