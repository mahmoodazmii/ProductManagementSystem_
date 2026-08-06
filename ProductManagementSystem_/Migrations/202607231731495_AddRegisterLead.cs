namespace ProductManagementSystem_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddRegisterLead : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.RegisterLeads",
                c => new
                    {
                        LeadId = c.Int(nullable: false, identity: true),
                        LeadDate = c.DateTime(nullable: false),
                        CompanyId = c.Int(nullable: false),
                        ProductId = c.Int(nullable: false),
                        Name = c.String(),
                        ContactNo = c.String(maxLength: 12),
                        EmailId = c.String(maxLength: 100),
                        Address = c.String(maxLength: 250),
                        Country = c.String(maxLength: 50),
                        State = c.String(maxLength: 50),
                        City = c.String(maxLength: 50),
                        Pincode = c.String(maxLength: 10),
                        Remarks = c.String(),
                        Status = c.String(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.LeadId)
                .ForeignKey("dbo.Companies", t => t.CompanyId, cascadeDelete: true)
                .ForeignKey("dbo.Products", t => t.ProductId, cascadeDelete: true)
                .Index(t => t.CompanyId)
                .Index(t => t.ProductId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.RegisterLeads", "ProductId", "dbo.Products");
            DropForeignKey("dbo.RegisterLeads", "CompanyId", "dbo.Companies");
            DropIndex("dbo.RegisterLeads", new[] { "ProductId" });
            DropIndex("dbo.RegisterLeads", new[] { "CompanyId" });
            DropTable("dbo.RegisterLeads");
        }
    }
}
