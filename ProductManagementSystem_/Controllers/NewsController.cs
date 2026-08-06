using ProductManagementSystem_.Models;
using System;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProductManagementSystem_.Controllers
{
    public class NewsController : Controller
    {
        private readonly ProductDbContext db = new ProductDbContext();

        public ActionResult Index() { return View(); }

        [HttpPost]
        public JsonResult SaveNews(News model, HttpPostedFileBase CoverImage, bool RemoveImage = false)
        {
            try
            {
                News entity;
                if (model.NewsId == 0)
                {
                    entity = new News { Topic = model.Topic, Content = model.Content, Status = model.Status };
                    db.News.Add(entity); db.SaveChanges();
                }
                else
                {
                    entity = db.News.Find(model.NewsId); if (entity == null) return Json(new { success = false, message = "Not found" });
                    entity.Topic = model.Topic; entity.Content = model.Content; entity.Status = model.Status; db.SaveChanges();
                }

                if (RemoveImage && !string.IsNullOrEmpty(entity.CoverImage)) { try { System.IO.File.Delete(Server.MapPath(entity.CoverImage)); } catch { } entity.CoverImage = null; }

                if (CoverImage != null && CoverImage.ContentLength > 0)
                {
                    string folder = Server.MapPath("~/UploadedFiles/News/");
                    if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);
                    string fileName = Guid.NewGuid() + Path.GetExtension(CoverImage.FileName);
                    CoverImage.SaveAs(Path.Combine(folder, fileName));
                    entity.CoverImage = "/UploadedFiles/News/" + fileName;
                }

                db.SaveChanges();
                return Json(new { success = true, message = "Saved" });
            }
            catch (Exception ex) { return Json(new { success = false, message = ex.Message }); }
        }

        [HttpGet]
        public JsonResult GetNews() { return Json(db.News.OrderByDescending(x => x.CreatedOn).ToList().Select(x => new { x.NewsId, x.Topic, x.CoverImage, x.Content, Status = x.Status ? "Active" : "Inactive" }), JsonRequestBehavior.AllowGet); }

        [HttpGet]
        public JsonResult EditNews(int id) { return Json(db.News.Find(id), JsonRequestBehavior.AllowGet); }

        [HttpGet]
        public JsonResult ViewNews(int id) { var item = db.News.Find(id); if (item == null) return Json(new { success = false }, JsonRequestBehavior.AllowGet); return Json(new { success = true, data = item }, JsonRequestBehavior.AllowGet); }

        [HttpPost]
        public JsonResult DeleteNews(int id)
        {
            try
            {
                var item = db.News.Find(id);
                if (item == null) return Json(new { success = false, message = "Not found" });
                if (!string.IsNullOrEmpty(item.CoverImage)) { try { System.IO.File.Delete(Server.MapPath(item.CoverImage)); } catch { } }
                db.News.Remove(item); db.SaveChanges();
                return Json(new { success = true, message = "Deleted" });
            }
            catch (Exception ex) { return Json(new { success = false, message = ex.Message }); }
        }
    }
}