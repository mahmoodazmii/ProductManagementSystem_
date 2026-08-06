using ProductManagementSystem_.Models;
using System.Collections.Generic;

namespace ProductManagementSystem_.ViewModels
{
    public class RegisterLeadViewModel
    {
        public RegisterLead RegisterLead { get; set; }
        public List<Category> Categories { get; set; }
        public List<Company> Companies { get; set; }
        public List<Product> Products { get; set; }
        public List<Disposition> Dispositions { get; set; }
        public List<Priority> Priorities { get; set; }
        public RegisterLeadViewModel()
        {
            RegisterLead = new RegisterLead();
            Companies = new List<Company>();
            Products = new List<Product>();
        }
    }
}