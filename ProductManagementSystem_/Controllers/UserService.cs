using ProductManagementSystem_.Models;
using System;
using System.Linq;

namespace ProductManagementSystem_.Services
{
    public class UserService
    {
        private readonly ProductDbContext db;
        public UserService()
        {
            db = new ProductDbContext();
        }
        public bool Add(User user)
        {
           try
            {
               bool exists = db.Users.Any(x => x.UserName.ToLower() == user.UserName.ToLower()
                );

                if (exists)
                {
                    return false;
                }

                db.Users.Add(user);
                db.SaveChanges();

                return true;

            }
            catch
            {

                return false;

            }

        }
        public User GetByUserName(string username)
        {

            return db.Users
                .FirstOrDefault(x =>
                    x.UserName.ToLower()
                    ==
                    username.ToLower()
                    &&
                    x.Status
                );

        }
         public User GetById(int id)
        {

            return db.Users
                .FirstOrDefault(x => x.UserId == id && x.Status
                );

        }

        public bool Update(User user)
        {

            try
            {

                var existing =
                    db.Users.FirstOrDefault(x =>
                        x.UserId == user.UserId);


                if (existing == null)
                {
                    return false;
                }

                existing.FullName = user.FullName;
                existing.Email = user.Email;
                existing.Status = user.Status;
                db.SaveChanges();

                return true;

            }
            catch
            {
               return false;

            }

        }

    }
}