using System.Collections.Generic;

namespace ProductManagementSystem_.ViewModels
{
    public class DashboardViewModel
    {
        public int TotalProducts { get; set; }
        public int TotalCategories { get; set; }
        public int TotalCompanies { get; set; }
        public List<RecentProductItem> RecentProducts { get; set; } = new List<RecentProductItem>();
        public List<string> RecentCategories { get; set; } = new List<string>();
        public List<string> RecentCompanies { get; set; } = new List<string>();
    }

    public class RecentProductItem
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string Category { get; set; }
        public string Company { get; set; }
        public int Stock { get; set; }
        public decimal SalePrice { get; set; }
    }
}