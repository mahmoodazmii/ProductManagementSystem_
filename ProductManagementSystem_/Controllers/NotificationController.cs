using ProductManagementSystem_.Models;
using System;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProductManagementSystem_.Controllers
{
    public class NotificationController : Controller
    {
        private readonly ProductDbContext db = new ProductDbContext();

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult SaveNotification(Notification model, HttpPostedFileBase CoverImage, bool RemoveImage = false)
        {
            try
            {
                Notification entity;
                if (model.NotificationId == 0)
                {
                    entity = new Notification
                    {
                        Topic = model.Topic,
                        Content = model.Content,
                        Status = model.Status
                    };
                    db.Notifications.Add(entity);
                    db.SaveChanges();
                }
                else
                {
                    entity = db.Notifications.Find(model.NotificationId);
                    if (entity == null) return Json(new { success = false, message = "Not found" });
                    entity.Topic = model.Topic;
                    entity.Content = model.Content;
                    entity.Status = model.Status;
                    db.SaveChanges();
                }

                if (RemoveImage && !string.IsNullOrEmpty(entity.CoverImage))
                {
                    try { System.IO.File.Delete(Server.MapPath(entity.CoverImage)); } catch { }
                    entity.CoverImage = null;
                }

                if (CoverImage != null && CoverImage.ContentLength > 0)
                {
                    string folder = Server.MapPath("~/UploadedFiles/Notifications/");
                    if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);
                    string fileName = Guid.NewGuid() + Path.GetExtension(CoverImage.FileName);
                    string path = Path.Combine(folder, fileName);
                    CoverImage.SaveAs(path);
                    entity.CoverImage = "/UploadedFiles/Notifications/" + fileName;
                }

                db.SaveChanges();
                return Json(new { success = true, message = "Saved successfully" });
            }
            catch (Exception ex) { return Json(new { success = false, message = ex.Message }); }
        }

        [HttpGet]
        public JsonResult GetNotification()
        {
            var list = db.Notifications.OrderByDescending(x => x.CreatedOn).ToList();
            return Json(list.Select(x => new { x.NotificationId, x.Topic, x.CoverImage, x.Content, Status = x.Status ? "Active" : "Inactive" }), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult EditNotification(int id)
        {
            var item = db.Notifications.Find(id);
            if (item == null) return Json(null, JsonRequestBehavior.AllowGet);
            return Json(item, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult ViewNotification(int id)
        {
            var item = db.Notifications.Find(id);
            if (item == null) return Json(new { success = false, message = "Not found" }, JsonRequestBehavior.AllowGet);
            return Json(new { success = true, data = item }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteNotification(int id)
        {
            try
            {
                var item = db.Notifications.Find(id);
                if (item == null) return Json(new { success = false, message = "Not found" });
                if (!string.IsNullOrEmpty(item.CoverImage)) { try { System.IO.File.Delete(Server.MapPath(item.CoverImage)); } catch { } }
                db.Notifications.Remove(item);
                db.SaveChanges();
                return Json(new { success = true, message = "Deleted" });
            }
            catch (Exception ex) { return Json(new { success = false, message = ex.Message }); }
        }
    }
}