using ProductManagementSystem_.Models;
using System.Collections.Generic;
using System.Web;

namespace ProductManagementSystem_.ViewModels
{
    public class ProductVM
    {
        public Product Product { get; set; }
        public List<Category> Categories { get; set; }
        public List<Company> Companies { get; set; }
        public IEnumerable<HttpPostedFileBase> Images { get; set; }
        public IEnumerable<HttpPostedFileBase> PdfFiles { get; set; }
    }
}