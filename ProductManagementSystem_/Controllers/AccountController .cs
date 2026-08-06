using ProductManagementSystem_.Helpers;
using ProductManagementSystem_.Models;
using ProductManagementSystem_.Services;
using ProductManagementSystem_.ViewModels;
using System.Linq;
using System.Web.Mvc;

namespace ProductManagementSystem_.Controllers
{
    public class AccountController : Controller
    {

        private readonly UserService userService = new UserService();
        private readonly ProductDbContext db = new ProductDbContext();

        [AllowAnonymous]
        public ActionResult Login(string ReturnUrl)
        {

            LoginViewModel model = new LoginViewModel();

            model.ReturnUrl = ReturnUrl;

            return View(model);

        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [AllowAnonymous]
        public ActionResult Login(LoginViewModel model)
        {

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = db.Users.FirstOrDefault(x => x.UserName == model.Username && x.Status);

            if (user == null)
            {

                ModelState.AddModelError("","Invalid Username or Password." );

                return View(model);

            }

            bool passwordValid =
                PasswordHelper.Verify( model.Password,user.PasswordHash, user.PasswordSalt);

            if (!passwordValid)
            {

                ModelState.AddModelError( "","Invalid Username or Password."
                );

                return View(model);

            }


            Session["UserId"] = user.UserId;
            Session["UserName"] = user.UserName;
            Session["FullName"] = user.FullName;
            Session["Email"] = user.Email;

            if (!string.IsNullOrEmpty(model.ReturnUrl))
            {
                if (Url.IsLocalUrl(model.ReturnUrl))
                {
                    return Redirect(model.ReturnUrl);
                }

            }

            return RedirectToAction( "Index", "Dashboard");

        }

        [AllowAnonymous]
        public ActionResult Register()
        {
            return View();

        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [AllowAnonymous]
        public ActionResult Register(RegisterViewModel model)
        {

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            bool usernameExist = db.Users.Any(x => x.UserName == model.UserName);

            if (usernameExist)
            {

                ModelState.AddModelError( "UserName","Username already exists." );

                return View(model);

            }

            bool emailExist = db.Users.Any(x => x.Email == model.Email);

            if (emailExist)
            {

                ModelState.AddModelError("Email","Email already exists.");

                return View(model);

            }

            string hash;
            string salt;

            PasswordHelper.Create( model.Password, out hash,out salt);

            User user = new User
            {

                FullName = model.FullName,
                UserName = model.UserName,
                Email = model.Email,
                PasswordHash = hash,
                PasswordSalt = salt,
                Status = true
            };

            bool result = userService.Add(user);

            if (!result)
            {
               ModelState.AddModelError(
                    "",
                    "Registration failed."
                );


                return View(model);

            }

            TempData["Success"] =
                "Registration Successful. Please Login.";

            return RedirectToAction(
                "Login"
            );

        }
        public ActionResult Logout()
        {

            Session.Clear();
            Session.RemoveAll();
            Session.Abandon();

            return RedirectToAction(
                "Login"
            );

        }
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {

                db.Dispose();

            }
            base.Dispose(disposing);

        }

    }
}