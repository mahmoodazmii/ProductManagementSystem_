using System.ComponentModel.DataAnnotations;

namespace ProductManagementSystem_.ViewModels
{
    public class ProfileViewModel
    {
        public int Id { get; set; }

        [Display(Name = "Username")]
        public string UserName { get; set; }

        [Required]
        [Display(Name = "Full name")]
        public string FullName { get; set; }

        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }
}