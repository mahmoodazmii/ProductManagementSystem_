using System;
using System.ComponentModel.DataAnnotations;

namespace ProductManagementSystem_.Models
{
    public class News
    {
        [Key]
        public int NewsId { get; set; }
        public string Topic { get; set; }
        public string CoverImage { get; set; }
        public string Content { get; set; }
        public bool Status { get; set; } = true;
        public DateTime CreatedOn { get; set; } = DateTime.Now;
    }
}