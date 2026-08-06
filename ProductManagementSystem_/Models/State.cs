using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProductManagementSystem_.Models
{
    public class State
    {
        [Key]
        public int StateId { get; set; }
        public int CountryId { get; set; }
        public string StateName { get; set; }
        public bool Status { get; set; } = true;
        [ForeignKey("CountryId")]
        public virtual Country Country { get; set; }
        public virtual ICollection<City> Cities { get; set; }
        public State()
        {
            Cities = new HashSet<City>();
        }
    }
}