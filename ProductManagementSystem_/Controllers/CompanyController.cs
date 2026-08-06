using ProductManagementSystem_.Filters;
using ProductManagementSystem_.Models;
using System;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProductManagementSystem_.Controllers
{
    [SessionAuthorize]
    public class CompanyController : Controller
    {
        ProductDbContext db = new ProductDbContext();

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult SaveCompany(Company model, HttpPostedFileBase Logo, bool RemoveLogo = false)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.CompanyName))
                {
                    return Json(new
                    {
                        success = false,
                        message = "Company Name Required."
                    });
                }

                string imagePath = "";

                if (Logo != null && Logo.ContentLength > 0)
                {
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(Logo.FileName);

                    string folderPath = Server.MapPath("~/UploadedFiles/Images/");

                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }

                    string fullPath = Path.Combine(folderPath, fileName);

                    Logo.SaveAs(fullPath);

                    imagePath = "/UploadedFiles/Images/" + fileName;
                }

                if (model.CompanyId == 0)
                {
                    Company obj = new Company();

                    obj.CompanyName = model.CompanyName;
                    obj.CompanyCode = model.CompanyCode;
                    obj.Description = model.Description;
                    obj.Status = model.Status;
                    obj.Logo = imagePath;

                    db.Companies.Add(obj);
                }

                else
                {
                    Company obj = db.Companies.Find(model.CompanyId);

                    if (obj == null)
                    {
                        return Json(new
                        {
                            success = false,
                            message = "Company Not Found."
                        });
                    }

                    obj.CompanyName = model.CompanyName;
                    obj.CompanyCode = model.CompanyCode;
                    obj.Description = model.Description;
                    obj.Status = model.Status;

                    if (RemoveLogo)
                    {
                        if (!string.IsNullOrEmpty(obj.Logo))
                        {
                            string oldFile = Server.MapPath(obj.Logo);

                            if (System.IO.File.Exists(oldFile))
                            {
                                System.IO.File.Delete(oldFile);
                            }

                            obj.Logo = "";
                        }
                    }

                    if (!string.IsNullOrEmpty(imagePath))
                    {

                        if (!string.IsNullOrEmpty(obj.Logo))
                        {
                            string oldFile = Server.MapPath(obj.Logo);

                            if (System.IO.File.Exists(oldFile))
                            {
                                System.IO.File.Delete(oldFile);
                            }
                        }

                        obj.Logo = imagePath;
                    }

                    db.Entry(obj).State = EntityState.Modified;

                    db.Entry(obj).State = System.Data.Entity.EntityState.Modified;
                }

                db.SaveChanges();

                return Json(new
                {
                    success = true,
                    message = "Company Saved Successfully."
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
        public JsonResult GetCompany()
        {
            var data = db.Companies
                         .OrderBy(x => x.CompanyId)
                         .Select(x => new
                         {
                             x.CompanyId,
                             x.CompanyName,
                             x.CompanyCode,
                             x.Description,
                             x.Logo,
                             Status = x.Status ? "A" : "D"
                         })
                         .ToList();

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult EditCompany(int id)
        {
            var data = db.Companies
                         .Where(x => x.CompanyId == id)
                         .Select(x => new
                         {
                             x.CompanyId,
                             x.CompanyName,
                             x.CompanyCode,
                             x.Description,
                             x.Logo,
                             x.Status
                         })
                         .FirstOrDefault();

            if (data == null)
            {
                return Json(new
                {
                    success = false,
                    message = "Company Not Found."
                }, JsonRequestBehavior.AllowGet);
            }

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteCompany(int id)
        {
            try
            {
                var data = db.Companies.Find(id);

                if (data == null)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Company Not Found."
                    });
                }

                if (!string.IsNullOrEmpty(data.Logo))
                {
                    string filePath = Server.MapPath(data.Logo);

                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

                db.Companies.Remove(data);

                db.SaveChanges();

                return Json(new
                {
                    success = true,
                    message = "Company Deleted Successfully."
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

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }

            base.Dispose(disposing);
        }

        [HttpGet]
        public JsonResult ViewCompany(int id)
        {
            var data = db.Companies
                         .Where(x => x.CompanyId == id)
                         .Select(x => new
                         {
                             x.CompanyId,
                             x.CompanyName,
                             x.CompanyCode,
                             x.Description,
                             x.Logo,

                             Status = x.Status ? "Active" : "Inactive"

                         })
                         .FirstOrDefault();


            if (data == null)
            {
                return Json(new
                {
                    success = false,
                    message = "Company Not Found."
                },
                JsonRequestBehavior.AllowGet);
            }


            return Json(new
            {
                success = true,
                data = data

            },
            JsonRequestBehavior.AllowGet);
        }
    }
}