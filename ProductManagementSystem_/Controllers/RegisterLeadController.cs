using ProductManagementSystem_.Models;
using ProductManagementSystem_.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web.Mvc;

namespace ProductManagementSystem_.Controllers
{
    public class RegisterLeadController : Controller
    {
        private ProductDbContext db = new ProductDbContext();

        public ActionResult Index()
        {
            RegisterLeadViewModel vm = new RegisterLeadViewModel();

            vm.RegisterLead = new RegisterLead
            {
                LeadDate = DateTime.Now,
                Status = "Open"
            };

            vm.Categories = db.Categories
                              .Where(x => x.Status)
                              .OrderBy(x => x.CategoryName)
                              .ToList() ?? new List<Category>();

            vm.Companies = db.Companies
                             .Where(x => x.Status)
                             .OrderBy(x => x.CompanyName)
                             .ToList() ?? new List<Company>();

            vm.Products = db.Products
                            .Where(x => x.Status)
                            .OrderBy(x => x.ProductName)
                            .ToList() ?? new List<Product>();

            vm.Dispositions = db.Dispositions
                            .Where(x => !x.IsDeleted)
                            .OrderBy(x => x.SortOrder)
                            .ToList();

            vm.Priorities = db.Priorities
                            .Where(x => !x.IsDeleted)
                            .OrderBy(x => x.PriorityName)
                            .ToList();

            return View(vm);
        }

        [HttpPost]
        public JsonResult SaveRegisterLead(RegisterLead model)
        {
            try
            {
                if (model == null)
                {
                    return Json(new { success = false, message = "Invalid Request." });
                }

                model.Name = (model.Name ?? "").Trim();
                model.ContactNo = (model.ContactNo ?? "").Trim();
                model.EmailId = (model.EmailId ?? "").Trim();
                model.Address = (model.Address ?? "").Trim();
                model.CaseType = (model.CaseType ?? "").Trim();
                model.ClientType = (model.ClientType ?? "").Trim();
                model.ExistingCompany = (model.ExistingCompany ?? "").Trim();
                model.PolicyNo = (model.PolicyNo ?? "").Trim();
                model.Pincode = (model.Pincode ?? "").Trim();
                model.Remarks = (model.Remarks ?? "").Trim();

                if (model.CategoryId <= 0)
                {
                    return Json(new { success = false, message = "Please Select Category." });
                }

                if (model.CompanyId <= 0)
                {
                    return Json(new { success = false, message = "Please Select Company." });
                }

                if (model.ProductId <= 0)
                {
                    return Json(new { success = false, message = "Please Select Product." });
                }

                if (string.IsNullOrWhiteSpace(model.CaseType))
                {
                    return Json(new { success = false, message = "Please Select Case Type." });
                }

                if (string.IsNullOrWhiteSpace(model.ClientType))
                {
                    return Json(new { success = false, message = "Please Select Client Type." });
                }

                if (model.CaseType == "Port")
                {
                    if (string.IsNullOrWhiteSpace(model.ExistingCompany))
                    {
                        return Json(new { success = false, message = "Please Enter Existing Company." });
                    }

                    if (string.IsNullOrWhiteSpace(model.PolicyNo))
                    {
                        return Json(new { success = false, message = "Please Enter Policy No." });
                    }

                    if (model.Amount == null)
                    {
                        return Json(new { success = false, message = "Please Enter Amount." });
                    }
                }

                if (model.CountryId <= 0)
                {
                    return Json(new { success = false, message = "Please Select Country." });
                }

                if (model.StateId <= 0)
                {
                    return Json(new { success = false, message = "Please Select State." });
                }

                if (model.CityId <= 0)
                {
                    return Json(new { success = false, message = "Please Select City." });
                }

                if (model.ClientType == "Individual")
                {
                    if (string.IsNullOrWhiteSpace(model.Name))
                    {
                        return Json(new { success = false, message = "Please Enter Name." });
                    }
                    model.ClientCompanyId = null;
                }
                else if (model.ClientType == "Company")
                {
                    if (string.IsNullOrWhiteSpace(model.Name))
                    {
                        return Json(new { success = false, message = "Please Enter Company Name." });
                    }
                    model.ClientCompanyId = null;
                }

                if (string.IsNullOrWhiteSpace(model.ContactNo))
                {
                    return Json(new { success = false, message = "Please Enter Contact Number." });
                }

                if (model.ContactNo.Length != 10 || !model.ContactNo.All(Char.IsDigit))
                {
                    return Json(new { success = false, message = "Contact Number must be 10 digits." });
                }

                if (!string.IsNullOrWhiteSpace(model.EmailId))
                {
                    try
                    {
                        MailAddress mail = new MailAddress(model.EmailId);
                    }
                    catch
                    {
                        return Json(new { success = false, message = "Invalid Email Address." });
                    }
                }

                bool duplicate = db.RegisterLeads.Any(x =>
                    !x.IsDeleted &&
                    x.ContactNo == model.ContactNo &&
                    x.LeadId != model.LeadId);

                if (duplicate)
                {
                    return Json(new { success = false, message = "Contact Number already exists." });
                }

                if (string.IsNullOrWhiteSpace(model.Status))
                {
                    model.Status = "Open";
                }

                var selectedCat = db.Categories.FirstOrDefault(x => x.CategoryId == model.CategoryId);
                var selectedCompany = db.Companies.FirstOrDefault(x => x.CompanyId == model.CompanyId);
                var selectedProduct = db.Products.FirstOrDefault(x => x.ProductId == model.ProductId);

                var selectedDisposition = model.DispositionId.HasValue
                    ? db.Dispositions.FirstOrDefault(x => x.DispositionId == model.DispositionId.Value)
                    : null;

                var selectedPriority = model.PriorityId.HasValue
                    ? db.Priorities.FirstOrDefault(x => x.PriorityId == model.PriorityId.Value)
                    : null;

                string catName = selectedCat != null ? selectedCat.CategoryName : "";
                string compName = selectedCompany != null ? selectedCompany.CompanyName : "";
                string prodName = selectedProduct != null ? selectedProduct.ProductName : "";
                string dispositionName = selectedDisposition != null ? selectedDisposition.DispositionName : "";
                string priorityName = selectedPriority != null ? selectedPriority.PriorityName : "";

                string message;

                if (model.LeadId == 0)
                {
                    RegisterLead lead = new RegisterLead
                    {
                        LeadDate = model.LeadDate,
                        CategoryId = model.CategoryId,
                        CategoryName = catName,
                        CompanyId = model.CompanyId,
                        CompanyName = compName,
                        ProductId = model.ProductId,
                        ProductName = prodName,

                        CaseType = model.CaseType,
                        ExistingCompany = model.ExistingCompany,
                        PolicyNo = model.PolicyNo,
                        Amount = model.Amount,

                        ClientType = model.ClientType,
                        ClientCompanyId = null,

                        Name = model.Name,
                        ContactNo = model.ContactNo,
                        EmailId = model.EmailId,
                        Address = model.Address,

                        CountryId = model.CountryId,
                        StateId = model.StateId,
                        CityId = model.CityId,

                        Pincode = model.Pincode,
                        Remarks = model.Remarks,

                        DispositionId = model.DispositionId,
                        DispositionName = dispositionName,

                        PriorityId = model.PriorityId,
                        PriorityName = priorityName,

                        VisitDate = model.VisitDate,
                        VisitTime = model.VisitTime,
                        Fixed = model.Fixed,

                        Status = model.Status,
                        IsDeleted = false
                    };

                    db.RegisterLeads.Add(lead);
                    message = "Record Saved Successfully.";
                }
                else
                {
                    RegisterLead lead = db.RegisterLeads.FirstOrDefault(x => x.LeadId == model.LeadId);

                    if (lead == null)
                    {
                        return Json(new { success = false, message = "Record not found." });
                    }

                    lead.LeadDate = model.LeadDate;
                    lead.CategoryId = model.CategoryId;
                    lead.CategoryName = catName;
                    lead.CompanyId = model.CompanyId;
                    lead.CompanyName = compName;
                    lead.ProductId = model.ProductId;
                    lead.ProductName = prodName;
                    lead.CaseType = model.CaseType;
                    lead.ExistingCompany = model.ExistingCompany;
                    lead.PolicyNo = model.PolicyNo;
                    lead.Amount = model.Amount;
                    lead.ClientType = model.ClientType;
                    lead.ClientCompanyId = null;
                    lead.Name = model.Name;
                    lead.ContactNo = model.ContactNo;
                    lead.EmailId = model.EmailId;
                    lead.Address = model.Address;
                    lead.CountryId = model.CountryId;
                    lead.StateId = model.StateId;
                    lead.CityId = model.CityId;
                    lead.Pincode = model.Pincode;
                    lead.Remarks = model.Remarks;
                    lead.Status = model.Status;
                    lead.DispositionId = model.DispositionId;
                    lead.DispositionName = dispositionName;
                    lead.PriorityId = model.PriorityId;
                    lead.PriorityName = priorityName;
                    lead.VisitDate = model.VisitDate;
                    lead.VisitTime = model.VisitTime;
                    lead.Fixed = model.Fixed;

                    message = "Record Updated Successfully.";
                }

                db.SaveChanges();

                return Json(new { success = true, message = message });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = ex.InnerException?.InnerException?.Message
                              ?? ex.InnerException?.Message
                              ?? ex.Message
                });
            }
        }

        [HttpGet]
        public JsonResult GetCategories()
        {
            try
            {
                var categories = db.Categories
                    .Where(x => x.Status)
                    .OrderBy(x => x.CategoryName)
                    .Select(x => new { x.CategoryId, x.CategoryName })
                    .ToList();

                return Json(new { success = true, data = categories }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetCompanies()
        {
            try
            {
                var companies = db.Companies
                    .Where(x => x.Status)
                    .OrderBy(x => x.CompanyName)
                    .Select(x => new { x.CompanyId, x.CompanyName })
                    .ToList();

                return Json(new { success = true, data = companies }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetProductsByCompany(int companyId)
        {
            try
            {
                var products = db.Products
                    .Where(x => x.CompanyId == companyId && x.Status)
                    .OrderBy(x => x.ProductName)
                    .Select(x => new { x.ProductId, x.ProductName })
                    .ToList();

                return Json(new { success = true, data = products }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetRegisterLead()
        {
            try
            {
                var data = db.RegisterLeads
                    .Where(x => !x.IsDeleted)
                    .Select(x => new
                    {
                        x.LeadId,
                        x.LeadDate,
                        Company = !string.IsNullOrEmpty(x.CompanyName)
                                    ? x.CompanyName
                                    : (x.Company != null ? x.Company.CompanyName : ""),
                        Product = !string.IsNullOrEmpty(x.ProductName)
                                    ? x.ProductName
                                    : (x.Product != null ? x.Product.ProductName : ""),
                        x.ContactNo,
                        x.Fixed,
                        x.Remarks,
                        x.Status
                    })
                    .OrderBy(x => x.LeadId)
                    .ToList();

                var result = data.Select(x => new
                {
                    x.LeadId,
                    LeadDate = x.LeadDate.ToString("dd-MM-yyyy"),
                    x.Company,
                    x.Product,
                    x.ContactNo,
                    Visit = x.Fixed,   
                    x.Remarks,
                    x.Status
                }).ToList();

                return Json(new { success = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult EditRegisterLead(int id)
        {
            try
            {
                var data = db.RegisterLeads
                    .Where(x => x.LeadId == id && !x.IsDeleted)
                    .Select(x => new
                    {
                        x.LeadId,
                        x.LeadDate,
                        x.CategoryId,
                        x.CompanyId,
                        x.ProductId,
                        x.DispositionId,
                        x.PriorityId,
                        x.CaseType,
                        x.ExistingCompany,
                        x.PolicyNo,
                        x.Amount,
                        x.ClientType,
                        x.Name,
                        x.ContactNo,
                        x.EmailId,
                        x.Address,
                        x.CountryId,
                        x.StateId,
                        x.CityId,
                        x.Pincode,
                        x.Remarks,
                        x.Status,
                        x.VisitDate,
                        x.VisitTime,
                        x.Fixed
                    })
                    .FirstOrDefault();

                if (data == null)
                {
                    return Json(new { success = false, message = "Record not found." }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { success = true, data = data }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult DeleteRegisterLead(int id)
        {
            try
            {
                var lead = db.RegisterLeads.FirstOrDefault(x => x.LeadId == id && !x.IsDeleted);
                if (lead == null)
                {
                    return Json(new { success = false, message = "Record not found." });
                }

                lead.IsDeleted = true;
                db.SaveChanges();

                return Json(new { success = true, message = "Record Deleted Successfully." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult GetCountries()
        {
            try
            {
                var countries = db.Countries.Where(x => x.Status).OrderBy(x => x.CountryName)
                    .Select(x => new { x.CountryId, x.CountryName }).ToList();
                return Json(new { success = true, data = countries }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetStates(int countryId)
        {
            try
            {
                var states = db.States.Where(x => x.CountryId == countryId && x.Status)
                    .OrderBy(x => x.StateName).Select(x => new { x.StateId, x.StateName }).ToList();
                return Json(new { success = true, data = states }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetCities(int stateId)
        {
            try
            {
                var cities = db.Cities.Where(x => x.StateId == stateId && x.Status)
                    .OrderBy(x => x.CityName).Select(x => new { x.CityId, x.CityName }).ToList();
                return Json(new { success = true, data = cities }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetDispositions()
        {
            try
            {
                var dispositions = db.Dispositions
                    .Where(x => !x.IsDeleted)
                    .OrderBy(x => x.SortOrder)
                    .Select(x => new { x.DispositionId, x.DispositionName })
                    .ToList();

                return Json(new { success = true, data = dispositions }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetPriorities()
        {
            try
            {
                var priorities = db.Priorities
                    .Where(x => !x.IsDeleted)
                    .OrderBy(x => x.PriorityName)
                    .Select(x => new { x.PriorityId, x.PriorityName })
                    .ToList();

                return Json(new { success = true, data = priorities }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) { db.Dispose(); }
            base.Dispose(disposing);
        }
    }
}