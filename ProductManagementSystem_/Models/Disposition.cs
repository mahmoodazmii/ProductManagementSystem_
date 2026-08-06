using System;
using System.ComponentModel.DataAnnotations;

namespace ProductManagementSystem_.Models
{
    public class Disposition
    {
        [Key]
        public int DispositionId { get; set; }
        public string DispositionName { get; set; }
        public string ShortCode { get; set; }
        public int SortOrder { get; set; }
        public bool DateRequired { get; set; }   
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime? ModifiedDate { get; set; }
        public bool IsDeleted { get; set; } = false;  
    }
}