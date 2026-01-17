using EquipmentTracker.Domain.Model;
using Microsoft.EntityFrameworkCore;

namespace EquipmentTracker.Data
{
    public class EquipmentDbContext : DbContext
    {
        public EquipmentDbContext(DbContextOptions<EquipmentDbContext> options) : base(options)
        {
        }

        public DbSet<Equipment> Equipment { get; set; }
        public DbSet<EquipmentStateChange> EquipmentStateChanges { get; set; }
        public DbSet<Order> Orders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<Order>()
                .HasOne(o => o.AssignedEquipment)
                .WithMany()
                .HasForeignKey(o => o.AssignedEquipmentId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}

