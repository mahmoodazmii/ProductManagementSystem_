using System;
using System.Security.Cryptography;

namespace ProductManagementSystem_.Helpers
{
    public static class PasswordHelper
    {

        private const int SaltSize = 16;
        private const int KeySize = 32;
        private const int Iterations = 10000;
        public static void Create(
            string password,
            out string hash,
            out string salt)
        {

            byte[] saltBytes = new byte[SaltSize];

            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(saltBytes);
            }

            using (var pbkdf2 =
                new Rfc2898DeriveBytes(
                    password,
                    saltBytes,
                    Iterations))
            {

                byte[] hashBytes =
                    pbkdf2.GetBytes(KeySize);

                hash = Convert.ToBase64String(hashBytes);
                salt = Convert.ToBase64String(saltBytes);

            }

        }
        public static bool Verify(string password, string storedHash, string storedSalt)
        {
            try
            {

                if (string.IsNullOrEmpty(storedHash) ||
                   string.IsNullOrEmpty(storedSalt))
                {
                    return false;
                }

                byte[] saltBytes = Convert.FromBase64String(storedSalt);

                byte[] oldHashBytes = Convert.FromBase64String(storedHash);

                using (var pbkdf2 = new Rfc2898DeriveBytes( password, saltBytes,Iterations))
                {

                    byte[] newHashBytes = pbkdf2.GetBytes(KeySize);

                    if (oldHashBytes.Length != newHashBytes.Length)
                    {
                        return false;
                    }

                    for (int i = 0; i < newHashBytes.Length; i++)
                    {

                        if (newHashBytes[i] != oldHashBytes[i])
                        {
                            return false;
                        }

                    }

                    return true;

                }

            }
            catch
            {

                return false;

            }

        }

    }
}