using System;
using System.Linq;
using System.Web.Mvc;
using ProductManagementSystem_.Models;
using ProductManagementSystem_.ViewModels;

namespace ProductManagementSystem_.Controllers
{
    public class PriorityController : Controller
    {
        private ProductDbContext db = new ProductDbContext();

        public ActionResult Index()
        {
            PriorityViewModel vm = new PriorityViewModel();
            vm.Priority = new Priority();

            return View(vm);
        }

        [HttpPost]
        public JsonResult SavePriority(Priority priority)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(priority.PriorityName))
                {
                    return Json(new
                    {
                        success = false,
                        message = "Priority Name is required."
                    });
                }

                if (string.IsNullOrWhiteSpace(priority.PriorityCode))
                {
                    return Json(new
                    {
                        success = false,
                        message = "Priority Code is required."
                    });
                }

                bool nameExists = db.Priorities.Any(x =>
                    x.PriorityName == priority.PriorityName &&
                    x.PriorityId != priority.PriorityId &&
                    !x.IsDeleted);

                if (nameExists)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Priority Name already exists."
                    });
                }

                bool codeExists = db.Priorities.Any(x =>
                    x.PriorityCode == priority.PriorityCode &&
                    x.PriorityId != priority.PriorityId &&
                    !x.IsDeleted);

                if (codeExists)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Priority Code already exists."
                    });
                }

                if (priority.PriorityId == 0)
                {
                    priority.CreatedDate = DateTime.Now;
                    priority.IsDeleted = false;

                    db.Priorities.Add(priority);
                }
                else
                {
                    var data = db.Priorities.Find(priority.PriorityId);

                    if (data == null)
                    {
                        return Json(new
                        {
                            success = false,
                            message = "Record not found."
                        });
                    }

                    data.PriorityName = priority.PriorityName;
                    data.PriorityCode = priority.PriorityCode;
                    data.Description = priority.Description;
                    data.ModifiedDate = DateTime.Now;
                }

                db.SaveChanges();

                return Json(new
                {
                    success = true,
                    message = "Priority saved successfully."
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

        [HttpGet]
        public JsonResult GetPriority()
        {
            try
            {
                var list = db.Priorities
                    .Where(x => !x.IsDeleted)
                    .OrderByDescending(x => x.PriorityId)
                    .Select(x => new
                    {
                        x.PriorityId,
                        x.PriorityName,
                        x.PriorityCode,
                        x.Description
                    })
                    .ToList();

                return Json(new
                {
                    success = true,
                    data = list
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

        [HttpGet]
        public JsonResult EditPriority(int id)
        {
            try
            {
                var data = db.Priorities
                    .Where(x => x.PriorityId == id)
                    .Select(x => new
                    {
                        x.PriorityId,
                        x.PriorityName,
                        x.PriorityCode,
                        x.Description
                    })
                    .FirstOrDefault();

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
        public JsonResult DeletePriority(int id)
        {
            try
            {
                var data = db.Priorities.Find(id);

                if (data == null)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Record not found."
                    });
                }

                data.IsDeleted = true;
                data.ModifiedDate = DateTime.Now;

                db.SaveChanges();

                return Json(new
                {
                    success = true,
                    message = "Priority deleted successfully."
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