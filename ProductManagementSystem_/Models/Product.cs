using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProductManagementSystem_.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        public int CategoryId { get; set; }

        public int CompanyId { get; set; }
        public string ProductName { get; set; }
        public string ProductCode { get; set; }

        public string SchemeOffer { get; set; }

        public decimal MRP { get; set; }

        public decimal Offer { get; set; }

        public decimal CostPrice { get; set; }

        public decimal SalePrice { get; set; }

        [NotMapped]
        public decimal Profit
        {
            get
            {
                return SalePrice - CostPrice;
            }
        }

        public decimal BPRate { get; set; }
        public decimal BPCommission { get; set; }
        public decimal Tax { get; set; }
        public string Description { get; set; }
        public bool Status { get; set; }
        public string ImageAttachment { get; set; }
        public string PdfAttachment { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; }

        [ForeignKey("CompanyId")]
        public virtual Company Company { get; set; }
    }
}