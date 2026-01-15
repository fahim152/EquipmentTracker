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
        public DbSet<ScheduledOrder> ScheduledOrders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Equipment>()
                .HasOne(e => e.CurrentOrder)
                .WithOne()
                .HasForeignKey<Equipment>(e => e.CurrentOrderId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ScheduledOrder>()
                .HasOne(so => so.Equipment)
                .WithMany(e => e.ScheduledOrders)
                .HasForeignKey(so => so.EquipmentId);

            modelBuilder.Entity<ScheduledOrder>()
                .HasOne(so => so.Order)
                .WithMany()
                .HasForeignKey(so => so.OrderId);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.AssignedEquipment)
                .WithMany()
                .HasForeignKey(o => o.AssignedEquipmentId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}

