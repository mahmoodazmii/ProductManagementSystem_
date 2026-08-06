namespace ProductManagementSystem_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addDispositionAndPriority : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Dispositions",
                c => new
                {
                    DispositionId = c.Int(nullable: false, identity: true),
                    DispositionName = c.String(),
                    ShortCode = c.String(),
                    SortOrder = c.Int(nullable: false),
                    DateRequired = c.Boolean(nullable: false),
                    CreatedDate = c.DateTime(nullable: false),
                    ModifiedDate = c.DateTime(),
                    IsDeleted = c.Boolean(nullable: false),
                })
                .PrimaryKey(t => t.DispositionId);

            CreateTable(
                "dbo.Priorities",
                c => new
                {
                    PriorityId = c.Int(nullable: false, identity: true),
                    PriorityName = c.String(),
                    PriorityCode = c.String(),
                    Description = c.String(),
                    CreatedDate = c.DateTime(nullable: false),
                    ModifiedDate = c.DateTime(),
                    IsDeleted = c.Boolean(nullable: false),
                })
                .PrimaryKey(t => t.PriorityId);
        }

        public override void Down()
        {
            DropTable("dbo.Priorities");
            DropTable("dbo.Dispositions");
        }

    }
}
