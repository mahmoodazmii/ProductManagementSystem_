using System.Data.Entity;

namespace ProductManagementSystem_.Models
{
    public class ProductDbContext : DbContext
    {
        public ProductDbContext()
            : base("ProductDbContext")
        {
            Database.SetInitializer<ProductDbContext>(null);
        }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Company> Companies { get; set; }

        public DbSet<Product> Products { get; set; }

        public DbSet<Country> Countries { get; set; }

        public DbSet<State> States { get; set; }

        public DbSet<City> Cities { get; set; }

        public DbSet<RegisterLead> RegisterLeads { get; set; }

        public DbSet<Notification> Notifications { get; set; }

        public DbSet<Notice> Notices { get; set; }

        public DbSet<News> News { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Disposition> Dispositions { get; set; }

        public DbSet<Priority> Priorities { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>()
                .HasRequired(x => x.Category)
                .WithMany()
                .HasForeignKey(x => x.CategoryId)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Product>()
                .HasRequired(x => x.Company)
                .WithMany()
                .HasForeignKey(x => x.CompanyId)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<User>()
                .HasKey(x => x.UserId);

            modelBuilder.Entity<State>()
                .HasRequired(x => x.Country)
                .WithMany(x => x.States)
                .HasForeignKey(x => x.CountryId)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<City>()
                .HasRequired(x => x.State)
                .WithMany(x => x.Cities)
                .HasForeignKey(x => x.StateId)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<RegisterLead>()
                .HasRequired(x => x.Country)
                .WithMany()
                .HasForeignKey(x => x.CountryId)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<RegisterLead>()
                .HasRequired(x => x.State)
                .WithMany()
                .HasForeignKey(x => x.StateId)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<RegisterLead>()
                .HasRequired(x => x.City)
                .WithMany()
                .HasForeignKey(x => x.CityId)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<RegisterLead>()
                .HasRequired(x => x.Category)
                .WithMany()
                .HasForeignKey(x => x.CategoryId)
                .WillCascadeOnDelete(false);
        }
    }
}