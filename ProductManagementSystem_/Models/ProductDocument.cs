using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ProductManagementSystem_.Models
{
    public class ProductDocument
    {
        [Key]
        public int DocumentId { get; set; }
        public int ProductId { get; set; }
        public string PDFPath { get; set; }
        public virtual Product Product { get; set; }
    }
}