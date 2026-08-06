using System.ComponentModel.DataAnnotations;

namespace ProductManagementSystem_.Models
{
    public class User
    {

        [Key]
        public int UserId { get; set; }
        public string FullName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string PasswordSalt { get; set; }
        public bool Status { get; set; } = true;


    }
}