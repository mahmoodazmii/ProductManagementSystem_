using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProductManagementSystem_.Models
{
    public class RegisterLead
    {
        [Key]
        public int LeadId { get; set; }
        public DateTime LeadDate { get; set; } = DateTime.Now;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int? DispositionId { get; set; }
        public string DispositionName { get; set; }
        public int? PriorityId { get; set; }
        public string PriorityName { get; set; }
        public string CaseType { get; set; }
        public string ExistingCompany { get; set; }
        public string PolicyNo { get; set; }
        public decimal? Amount { get; set; }
        public string ClientType { get; set; }
        public int? ClientCompanyId { get; set; }
        public string Name { get; set; }
        public string ContactNo { get; set; }
        public string EmailId { get; set; }
        public string Address { get; set; }
        public int CountryId { get; set; }
        public int StateId { get; set; }
        public int CityId { get; set; }
        public string Pincode { get; set; }
        public string Remarks { get; set; }
        public string Status { get; set; }
        public bool IsDeleted { get; set; } = false;
        public DateTime? VisitDate { get; set; }
        public string VisitTime { get; set; }
        public string Fixed { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; }
        [ForeignKey("CompanyId")]
        public virtual Company Company { get; set; }
        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }

        [ForeignKey("ClientCompanyId")]
        public virtual Company ClientCompany { get; set; }

        [ForeignKey("CountryId")]
        public virtual Country Country { get; set; }

        [ForeignKey("StateId")]
        public virtual State State { get; set; }

        [ForeignKey("CityId")]
        public virtual City City { get; set; }
    }
}