using ProductManagementSystem_.Filters;
using ProductManagementSystem_.Models;
using ProductManagementSystem_.ViewModels;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProductManagementSystem_.Controllers
{
    [SessionAuthorize]
    public class ProductController : Controller
    {
        private readonly ProductDbContext db = new ProductDbContext();
        public ActionResult Index()
        {
            try
            {
                ProductVM vm = new ProductVM();

                vm.Product = new Product();

                vm.Categories = db.Categories
                                  .Where(x => x.Status)
                                  .OrderBy(x => x.CategoryName)
                                  .ToList();

                vm.Companies = db.Companies
                                 .Where(x => x.Status)
                                 .OrderBy(x => x.CompanyName)
                                 .ToList();

                return View(vm);
            }
            catch (Exception ex)
            {
                ViewBag.ErrorMessage = ex.Message;

                ProductVM vm = new ProductVM
                {
                    Product = new Product(),
                    Categories = new List<Category>(),
                    Companies = new List<Company>()
                };

                return View(vm);
            }
        }

        [HttpPost]
        public JsonResult SaveProduct(
    Product model,
    IEnumerable<HttpPostedFileBase> Images,
    IEnumerable<HttpPostedFileBase> PdfFiles,
    string ExistingImages,
    string ExistingPDFs)
        {
            try
            {
                if (model == null)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Invalid Product Data."
                    });
                }

                if (model.CategoryId <= 0)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Please Select Category."
                    });
                }

                if (model.CompanyId <= 0)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Please Select Company."
                    });
                }

                if (string.IsNullOrWhiteSpace(model.ProductName))
                {
                    return Json(new
                    {
                        success = false,
                        message = "Product Name Required."
                    });
                }

                if (string.IsNullOrWhiteSpace(model.ProductCode))
                {
                    return Json(new
                    {
                        success = false,
                        message = "Product Code Required."
                    });
                }

                string imageFolder = Server.MapPath("~/Content/Uploads/Images/");
                string pdfFolder = Server.MapPath("~/Content/Uploads/PDFs/");


                if (!Directory.Exists(imageFolder))
                    Directory.CreateDirectory(imageFolder);

                if (!Directory.Exists(pdfFolder))
                    Directory.CreateDirectory(pdfFolder);

                Product product;

                if (model.ProductId > 0)
                {
                    product = db.Products.FirstOrDefault(x => x.ProductId == model.ProductId);

                    if (product == null)
                    {
                        return Json(new
                        {
                            success = false,
                            message = "Product Not Found."
                        });
                    }
                }
                else
                {
                    product = new Product();
                    db.Products.Add(product);
                }

                product.CategoryId = model.CategoryId;
                product.CompanyId = model.CompanyId;
                product.ProductName = model.ProductName.Trim();
                product.ProductCode = model.ProductCode.Trim();
                product.SchemeOffer = model.SchemeOffer;
                product.MRP = model.MRP;
                product.Offer = model.Offer;
                product.CostPrice = model.CostPrice;
                product.SalePrice = model.SalePrice;
                product.BPRate = model.BPRate;
                product.BPCommission = model.BPCommission;
                product.Tax = model.Tax;
                product.Description = model.Description;
                product.Status = model.Status;

                List<string> imageList = new List<string>();
                List<string> pdfList = new List<string>();

                if (!string.IsNullOrWhiteSpace(ExistingImages))
                {
                    imageList = ExistingImages
                        .Split('|')
                        .Where(x => !string.IsNullOrWhiteSpace(x))
                        .ToList();
                }

                if (!string.IsNullOrWhiteSpace(ExistingPDFs))
                {
                    pdfList = ExistingPDFs
                        .Split('|')
                        .Where(x => !string.IsNullOrWhiteSpace(x))
                        .ToList();
                }


        if (Images != null)
        {
            foreach (HttpPostedFileBase file in Images)
            {
                if (file == null || file.ContentLength == 0)
                    continue;

                string extension = Path.GetExtension(file.FileName).ToLower();

                if (extension != ".jpg" &&
                    extension != ".jpeg" &&
                    extension != ".png")
                {
                    continue;
                }

                string fileName = Guid.NewGuid().ToString("N") + extension;

                string savePath = Path.Combine(imageFolder, fileName);

                file.SaveAs(savePath);

                if (System.IO.File.Exists(savePath))
                {
                    imageList.Add(fileName);
                }
                else
                {
                    throw new Exception("Image Save Failed : " + savePath);
                }
            }
        }

        //================ PDF UPLOAD ===================

        if (PdfFiles != null)
        {
            foreach (HttpPostedFileBase file in PdfFiles)
            {
                if (file == null || file.ContentLength == 0)
                    continue;

                string extension = Path.GetExtension(file.FileName).ToLower();

                if (extension != ".pdf")
                    continue;

                string fileName = Guid.NewGuid().ToString("N") + extension;

                string savePath = Path.Combine(pdfFolder, fileName);

                file.SaveAs(savePath);

                if (System.IO.File.Exists(savePath))
                {
                    pdfList.Add(fileName);
                }
                else
                {
                    throw new Exception("PDF Save Failed : " + savePath);
                }
            }
        }

        product.ImageAttachment = string.Join("|", imageList);
        product.PdfAttachment = string.Join("|", pdfList);

        db.SaveChanges();

        return Json(new
        {
            success = true,
            message = model.ProductId == 0
                ? "Product Saved Successfully."
                : "Product Updated Successfully."
        });
    }
    catch (Exception ex)
    {
        return Json(new
        {
            success = false,
            message = ex.Message,
            details = ex.ToString()
        });
    }
}

        [HttpGet]
        public JsonResult GetProduct()
        {
            try
            {
               var data = db.Products
                            .Include(x => x.Category)
                            .Include(x => x.Company)
                            .OrderBy(x => x.ProductId)
                            .ToList();

                var result = data.Select(x => new
                {
                    x.ProductId,

                    Category = x.Category != null
                                ? x.Category.CategoryName
                                : "",

                    Company = x.Company != null
                                ? x.Company.CompanyName
                                : "",

                    x.ProductName,

                    x.ProductCode,

                    x.SchemeOffer,

                    x.MRP,

                    x.Offer,

                    x.CostPrice,

                    x.SalePrice,

                    Profit = x.SalePrice - x.CostPrice,

                    x.BPRate,

                    x.BPCommission,

                    x.Tax,

                    x.Description,

                    Status = x.Status ? "Active" : "Inactive",

                    Images = string.IsNullOrWhiteSpace(x.ImageAttachment)
                        ? new string[] { }
                        : x.ImageAttachment
                            .Split('|')
                            .Where(a => !string.IsNullOrWhiteSpace(a))
                            .ToArray(),

                    Pdfs = string.IsNullOrWhiteSpace(x.PdfAttachment)
                        ? new string[] { }
                        : x.PdfAttachment
                            .Split('|')
                            .Where(a => !string.IsNullOrWhiteSpace(a))
                            .ToArray()
                }).ToList();

                return Json(result, JsonRequestBehavior.AllowGet);
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
        public JsonResult EditProduct(int id)
        {
            try
            {
                var product = db.Products
                                .AsNoTracking()
                                .FirstOrDefault(x => x.ProductId == id);

                if (product == null)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Product not found."
                    }, JsonRequestBehavior.AllowGet);
                }

                List<string> imageList = new List<string>();
                List<string> pdfList = new List<string>();

                if (!string.IsNullOrWhiteSpace(product.ImageAttachment))
                {
                    imageList = product.ImageAttachment
                                       .Split('|')
                                       .Where(x => !string.IsNullOrWhiteSpace(x))
                                       .ToList();
                }

                if (!string.IsNullOrWhiteSpace(product.PdfAttachment))
                {
                    pdfList = product.PdfAttachment
                                     .Split('|')
                                     .Where(x => !string.IsNullOrWhiteSpace(x))
                                     .ToList();
                }

                return Json(new
                {
                    success = true,

                    ProductId = product.ProductId,

                    CategoryId = product.CategoryId,

                    CompanyId = product.CompanyId,

                    ProductName = product.ProductName,

                    ProductCode = product.ProductCode,

                    SchemeOffer = product.SchemeOffer,

                    MRP = product.MRP,

                    Offer = product.Offer,

                    CostPrice = product.CostPrice,

                    SalePrice = product.SalePrice,

                    Profit = product.SalePrice - product.CostPrice,

                    BPRate = product.BPRate,

                    BPCommission = product.BPCommission,

                    Tax = product.Tax,

                    Description = product.Description,

                    Status = product.Status,

                    Images = imageList,

                    Pdfs = pdfList
                },
                JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = ex.Message
                },
                JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult ViewProduct(int id)
        {
            try
            {
                var product = db.Products
                                .Include(x => x.Category)
                                .Include(x => x.Company)
                                .FirstOrDefault(x => x.ProductId == id);

                if (product == null)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Product not found."
                    }, JsonRequestBehavior.AllowGet);
                }

                List<string> imageList = new List<string>();
                List<string> pdfList = new List<string>();

                if (!string.IsNullOrWhiteSpace(product.ImageAttachment))
                {
                    imageList = product.ImageAttachment
                                       .Split('|')
                                       .Where(x => !string.IsNullOrWhiteSpace(x))
                                       .ToList();
                }

                if (!string.IsNullOrWhiteSpace(product.PdfAttachment))
                {
                    pdfList = product.PdfAttachment
                                     .Split('|')
                                     .Where(x => !string.IsNullOrWhiteSpace(x))
                                     .ToList();
                }

                return Json(new
                {
                    success = true,

                    ProductId = product.ProductId,

                    CategoryId = product.CategoryId,
                    CompanyId = product.CompanyId,

                    Category = product.Category != null
                                ? product.Category.CategoryName
                                : "",

                    Company = product.Company != null
                                ? product.Company.CompanyName
                                : "",

                    ProductName = product.ProductName,
                    ProductCode = product.ProductCode,

                    SchemeOffer = product.SchemeOffer,

                    MRP = product.MRP,
                    Offer = product.Offer,

                    CostPrice = product.CostPrice,
                    SalePrice = product.SalePrice,

                    Profit = product.SalePrice - product.CostPrice,

                    BPRate = product.BPRate,
                    BPCommission = product.BPCommission,

                    Tax = product.Tax,

                    Description = product.Description,

                    Status = product.Status,

                    Images = imageList,

                    Pdfs = pdfList
                },
                JsonRequestBehavior.AllowGet);
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
        public JsonResult DeleteProduct(int id)
        {
            try
            {
                var product = db.Products.FirstOrDefault(x => x.ProductId == id);

                if (product == null)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Product not found."
                    });
                }

                string imageFolder = Server.MapPath("/Content/Uploads/Images/");
                string pdfFolder = Server.MapPath("/Content/Uploads/PDFs/");

                if (!string.IsNullOrWhiteSpace(product.ImageAttachment))
                {
                    foreach (string file in product.ImageAttachment
                                                   .Split('|')
                                                   .Where(x => !string.IsNullOrWhiteSpace(x)))
                    {
                        string filePath = Path.Combine(imageFolder, file);

                        if (System.IO.File.Exists(filePath))
                        {
                            System.IO.File.Delete(filePath);
                        }
                    }
                }

                if (!string.IsNullOrWhiteSpace(product.PdfAttachment))
                {
                    foreach (string file in product.PdfAttachment
                                                   .Split('|')
                                                   .Where(x => !string.IsNullOrWhiteSpace(x)))
                    {
                        string filePath = Path.Combine(pdfFolder, file);

                        if (System.IO.File.Exists(filePath))
                        {
                            System.IO.File.Delete(filePath);
                        }
                    }
                }

                db.Products.Remove(product);

                db.SaveChanges();

                return Json(new
                {
                    success = true,
                    message = "Product deleted successfully."
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