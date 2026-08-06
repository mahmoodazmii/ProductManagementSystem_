using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProductManagementSystem_.Models
{
    public class City
    {
        [Key]
        public int CityId { get; set; }
        public int StateId { get; set; }
        public string CityName { get; set; }
        public bool Status { get; set; } = true;
        [ForeignKey("StateId")]
        public virtual State State { get; set; }
    }
}