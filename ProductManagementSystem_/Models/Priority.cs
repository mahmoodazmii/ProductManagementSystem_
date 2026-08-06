using System;
using System.ComponentModel.DataAnnotations;

namespace ProductManagementSystem_.Models
{
    public class Priority
    {
        [Key]
        public int PriorityId { get; set; }
        public string PriorityName { get; set; }
        public string PriorityCode { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime? ModifiedDate { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}