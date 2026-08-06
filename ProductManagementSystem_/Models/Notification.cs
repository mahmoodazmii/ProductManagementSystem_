using System;
using System.ComponentModel.DataAnnotations;

namespace ProductManagementSystem_.Models
{
    public class Notification
    {
        [Key]
        public int NotificationId { get; set; }
        public string Topic { get; set; }
        public string CoverImage { get; set; }
        public string Content { get; set; }
        public bool Status { get; set; } = true;
        public DateTime CreatedOn { get; set; } = DateTime.Now;
    }
}