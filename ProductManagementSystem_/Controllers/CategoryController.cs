using ProductManagementSystem_.Filters;
using ProductManagementSystem_.Models;
using System;
using System.Linq;
using System.Web.Mvc;

namespace ProductManagementSystem_.Controllers
{
    [SessionAuthorize]
    public class CategoryController : Controller
    {
        ProductDbContext db = new ProductDbContext();

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult SaveCategory(Category model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.CategoryName))
                {
                    return Json(new
                    {
                        success = false,
                        message = "Category Name Required."
                    });
                }

                if (model.CategoryId == 0)
                {
                    Category obj = new Category();

                    obj.CategoryName = model.CategoryName;
                    obj.Description = model.Description;
                    obj.Status = model.Status;

                    db.Categories.Add(obj);
                }
                else
                {
                    var obj = db.Categories.Find(model.CategoryId);

                    if (obj == null)
                    {
                        return Json(new
                        {
                            success = false,
                            message = "Category Not Found."
                        });
                    }

                    obj.CategoryName = model.CategoryName;
                    obj.Description = model.Description;
                    obj.Status = model.Status;

                    db.Entry(obj).State = System.Data.Entity.EntityState.Modified;
                }

                db.SaveChanges();

                return Json(new
                {
                    success = true,
                    message = "Category Saved Successfully."
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
        public JsonResult GetCategory()
        {
            var data = db.Categories
                .OrderBy(x => x.CategoryId)
                .ToList()
                .Select(x => new
                {
                    x.CategoryId,
                    x.CategoryName,
                    x.Description,
                    Status = x.Status ? "A" : "D"
                });

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult EditCategory(int id)
        {
            var data = db.Categories
                         .Where(x => x.CategoryId == id)
                         .Select(x => new
                         {
                             x.CategoryId,
                             x.CategoryName,
                             x.Description,
                             x.Status
                         })
                         .FirstOrDefault();

            if (data == null)
            {
                return Json(new
                {
                    success = false,
                    message = "Category Not Found."
                }, JsonRequestBehavior.AllowGet);
            }

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ViewCategory(int id)
        {
            var data = db.Categories.Find(id);

            if (data == null)
            {
                return Json(new
                {
                    success = false,
                    message = "Category Not Found"
                }, JsonRequestBehavior.AllowGet);
            }

            return Json(new
            {
                success = true,
                data = new
                {
                    data.CategoryId,
                    data.CategoryName,
                    data.Description,
                    Status = data.Status ? "Active" : "Inactive"
                }
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteCategory(int id)
        {
            try
            {
                var data = db.Categories.Find(id);

                if (data == null)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Category Not Found."
                    });
                }

                db.Categories.Remove(data);

                db.SaveChanges();

                return Json(new
                {
                    success = true,
                    message = "Category Deleted Successfully."
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