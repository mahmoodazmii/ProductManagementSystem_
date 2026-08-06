namespace ProductManagementSystem_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCountryStateCity : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Cities",
                c => new
                    {
                        CityId = c.Int(nullable: false, identity: true),
                        StateId = c.Int(nullable: false),
                        CityName = c.String(),
                        Status = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.CityId)
                .ForeignKey("dbo.States", t => t.StateId)
                .Index(t => t.StateId);
            
            CreateTable(
                "dbo.States",
                c => new
                    {
                        StateId = c.Int(nullable: false, identity: true),
                        CountryId = c.Int(nullable: false),
                        StateName = c.String(),
                        Status = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.StateId)
                .ForeignKey("dbo.Countries", t => t.CountryId)
                .Index(t => t.CountryId);
            
            CreateTable(
                "dbo.Countries",
                c => new
                    {
                        CountryId = c.Int(nullable: false, identity: true),
                        CountryName = c.String(),
                        Status = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.CountryId);
            
            AddColumn("dbo.RegisterLeads", "CountryId", c => c.Int(nullable: false));
            AddColumn("dbo.RegisterLeads", "StateId", c => c.Int(nullable: false));
            AddColumn("dbo.RegisterLeads", "CityId", c => c.Int(nullable: false));
            AlterColumn("dbo.RegisterLeads", "ContactNo", c => c.String());
            AlterColumn("dbo.RegisterLeads", "EmailId", c => c.String());
            AlterColumn("dbo.RegisterLeads", "Address", c => c.String());
            AlterColumn("dbo.RegisterLeads", "Pincode", c => c.String());
            AlterColumn("dbo.RegisterLeads", "Status", c => c.String());
            CreateIndex("dbo.RegisterLeads", "CountryId");
            CreateIndex("dbo.RegisterLeads", "StateId");
            CreateIndex("dbo.RegisterLeads", "CityId");
            AddForeignKey("dbo.RegisterLeads", "CityId", "dbo.Cities", "CityId");
            AddForeignKey("dbo.RegisterLeads", "CountryId", "dbo.Countries", "CountryId");
            AddForeignKey("dbo.RegisterLeads", "StateId", "dbo.States", "StateId");
            DropColumn("dbo.RegisterLeads", "Country");
            DropColumn("dbo.RegisterLeads", "State");
            DropColumn("dbo.RegisterLeads", "City");
        }
        
        public override void Down()
        {
            AddColumn("dbo.RegisterLeads", "City", c => c.String(maxLength: 50));
            AddColumn("dbo.RegisterLeads", "State", c => c.String(maxLength: 50));
            AddColumn("dbo.RegisterLeads", "Country", c => c.String(maxLength: 50));
            DropForeignKey("dbo.RegisterLeads", "StateId", "dbo.States");
            DropForeignKey("dbo.RegisterLeads", "CountryId", "dbo.Countries");
            DropForeignKey("dbo.RegisterLeads", "CityId", "dbo.Cities");
            DropForeignKey("dbo.Cities", "StateId", "dbo.States");
            DropForeignKey("dbo.States", "CountryId", "dbo.Countries");
            DropIndex("dbo.RegisterLeads", new[] { "CityId" });
            DropIndex("dbo.RegisterLeads", new[] { "StateId" });
            DropIndex("dbo.RegisterLeads", new[] { "CountryId" });
            DropIndex("dbo.States", new[] { "CountryId" });
            DropIndex("dbo.Cities", new[] { "StateId" });
            AlterColumn("dbo.RegisterLeads", "Status", c => c.String(nullable: false));
            AlterColumn("dbo.RegisterLeads", "Pincode", c => c.String(maxLength: 10));
            AlterColumn("dbo.RegisterLeads", "Address", c => c.String(maxLength: 250));
            AlterColumn("dbo.RegisterLeads", "EmailId", c => c.String(maxLength: 100));
            AlterColumn("dbo.RegisterLeads", "ContactNo", c => c.String(maxLength: 12));
            DropColumn("dbo.RegisterLeads", "CityId");
            DropColumn("dbo.RegisterLeads", "StateId");
            DropColumn("dbo.RegisterLeads", "CountryId");
            DropTable("dbo.Countries");
            DropTable("dbo.States");
            DropTable("dbo.Cities");
        }
    }
}
