using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProductManagementSystem_.Models
{
    public class Country
    {
        [Key]
        public int CountryId { get; set; }
        public string CountryName { get; set; }
        public bool Status { get; set; } = true;
        public virtual ICollection<State> States { get; set; }
        public Country()
        {
            States = new HashSet<State>();
        }
    }
}