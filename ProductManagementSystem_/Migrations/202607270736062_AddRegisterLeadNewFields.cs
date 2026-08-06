namespace ProductManagementSystem_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddRegisterLeadNewFields : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.RegisterLeads", "CaseType", c => c.String());
            AddColumn("dbo.RegisterLeads", "ExistingCompany", c => c.String());
            AddColumn("dbo.RegisterLeads", "PolicyNo", c => c.String());
            AddColumn("dbo.RegisterLeads", "Amount", c => c.Decimal(precision: 18, scale: 2));
            AddColumn("dbo.RegisterLeads", "ClientType", c => c.String());
            AddColumn("dbo.RegisterLeads", "ClientCompanyId", c => c.Int());
            CreateIndex("dbo.RegisterLeads", "ClientCompanyId");
            AddForeignKey("dbo.RegisterLeads", "ClientCompanyId", "dbo.Companies", "CompanyId");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.RegisterLeads", "ClientCompanyId", "dbo.Companies");
            DropIndex("dbo.RegisterLeads", new[] { "ClientCompanyId" });
            DropColumn("dbo.RegisterLeads", "ClientCompanyId");
            DropColumn("dbo.RegisterLeads", "ClientType");
            DropColumn("dbo.RegisterLeads", "Amount");
            DropColumn("dbo.RegisterLeads", "PolicyNo");
            DropColumn("dbo.RegisterLeads", "ExistingCompany");
            DropColumn("dbo.RegisterLeads", "CaseType");
        }
    }
}
