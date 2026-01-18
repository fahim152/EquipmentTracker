using EquipmentTracker.Domain.Enum;
using EquipmentTracker.Domain.Model;
using Microsoft.EntityFrameworkCore;

namespace EquipmentTracker.Data
{
    public static class DatabaseInitializer
    {
        public static void Initialize(EquipmentDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Equipment.Any())
            {
                return;
            }

            var equipment = new List<Equipment>
            {
                // Moulding machines
                new Equipment { Id = 1, Name = "Moulding 1", CurrentState = EquipmentState.Green },
                new Equipment { Id = 2, Name = "Moulding 2", CurrentState = EquipmentState.Green },
                new Equipment { Id = 3, Name = "Moulding 3", CurrentState = EquipmentState.Yellow },
                new Equipment { Id = 4, Name = "Moulding 4", CurrentState = EquipmentState.Red },
                
                // Roughing machines
                new Equipment { Id = 5, Name = "Roughing 1", CurrentState = EquipmentState.Red },
                new Equipment { Id = 6, Name = "Roughing 2", CurrentState = EquipmentState.Green },
                new Equipment { Id = 7, Name = "Roughing 3", CurrentState = EquipmentState.Yellow },
                
                // Finishing machines
                new Equipment { Id = 8, Name = "Finishing 1", CurrentState = EquipmentState.Yellow },
                new Equipment { Id = 9, Name = "Finishing 2", CurrentState = EquipmentState.Green },
                new Equipment { Id = 10, Name = "Finishing 3", CurrentState = EquipmentState.Green },
                
                // Assembly lines
                new Equipment { Id = 11, Name = "Assembly Line A", CurrentState = EquipmentState.Green },
                new Equipment { Id = 12, Name = "Assembly Line B", CurrentState = EquipmentState.Yellow },
                new Equipment { Id = 13, Name = "Assembly Line C", CurrentState = EquipmentState.Red },
                
                // Painting stations
                new Equipment { Id = 14, Name = "Painter 1", CurrentState = EquipmentState.Green },
                new Equipment { Id = 15, Name = "Painter 2", CurrentState = EquipmentState.Green },
                new Equipment { Id = 16, Name = "Painter 3", CurrentState = EquipmentState.Red },
                
                // Quality control
                new Equipment { Id = 17, Name = "QC Station 1", CurrentState = EquipmentState.Green },
                new Equipment { Id = 18, Name = "QC Station 2", CurrentState = EquipmentState.Yellow },
                
                // Packaging
                new Equipment { Id = 19, Name = "Packaging Line 1", CurrentState = EquipmentState.Green },
                new Equipment { Id = 20, Name = "Packaging Line 2", CurrentState = EquipmentState.Green },
                new Equipment { Id = 21, Name = "Packaging Line 3", CurrentState = EquipmentState.Yellow }
            };

            context.Equipment.AddRange(equipment);
            context.SaveChanges();

            var now = DateTime.UtcNow;
            var stateChanges = new List<EquipmentStateChange>
            {
                // Moulding machines
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 1, State = EquipmentState.Green, Timestamp = now.AddHours(-2), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 2, State = EquipmentState.Green, Timestamp = now.AddHours(-3), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 3, State = EquipmentState.Yellow, Timestamp = now.AddHours(-1), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 4, State = EquipmentState.Red, Timestamp = now.AddHours(-4), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
                
                // Roughing machines
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 5, State = EquipmentState.Red, Timestamp = now.AddHours(-5), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 6, State = EquipmentState.Green, Timestamp = now.AddHours(-2), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 7, State = EquipmentState.Yellow, Timestamp = now.AddHours(-3), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
                
                // Finishing machines
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 8, State = EquipmentState.Yellow, Timestamp = now.AddHours(-1), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 9, State = EquipmentState.Green, Timestamp = now.AddHours(-2), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 10, State = EquipmentState.Green, Timestamp = now.AddHours(-4), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
                
                // Assembly lines
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 11, State = EquipmentState.Green, Timestamp = now.AddHours(-3), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 12, State = EquipmentState.Yellow, Timestamp = now.AddHours(-2), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 13, State = EquipmentState.Red, Timestamp = now.AddHours(-6), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
                
                // Painting stations
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 14, State = EquipmentState.Green, Timestamp = now.AddHours(-1), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 15, State = EquipmentState.Green, Timestamp = now.AddHours(-2), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 16, State = EquipmentState.Red, Timestamp = now.AddHours(-5), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
                
                // Quality control
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 17, State = EquipmentState.Green, Timestamp = now.AddHours(-3), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 18, State = EquipmentState.Yellow, Timestamp = now.AddHours(-4), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
                
                // Packaging
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 19, State = EquipmentState.Green, Timestamp = now.AddHours(-2), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 20, State = EquipmentState.Green, Timestamp = now.AddHours(-1), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
                new EquipmentStateChange { Id = Guid.NewGuid(), EquipmentId = 21, State = EquipmentState.Yellow, Timestamp = now.AddHours(-3), ChangedById = Guid.Parse("00000000-0000-0000-0000-000000000001") },
            };

            context.EquipmentStateChanges.AddRange(stateChanges);
            context.SaveChanges();

            var orders = new List<Order>
            {
                new Order { Id = 1, OrderNumber = "ORD-2026-001", ProductName = "Classic Brick 2x4 Red", QuantityRequested = 50000, QuantityProduced = 35000, CreatedAt = now.AddDays(-2), ScheduledStartTime = now.AddHours(-3), EstimatedEndTime = now.AddHours(2), ActualStartTime = now.AddHours(-2), Status = OrderStatus.InProgress, Priority = OrderPriority.High, AssignedEquipmentId = 1 },
                new Order { Id = 2, OrderNumber = "ORD-2026-002", ProductName = "Classic Brick 2x4 Blue", QuantityRequested = 45000, QuantityProduced = 42000, CreatedAt = now.AddDays(-2), ScheduledStartTime = now.AddHours(-4), EstimatedEndTime = now.AddHours(1), ActualStartTime = now.AddHours(-3), Status = OrderStatus.InProgress, Priority = OrderPriority.Normal, AssignedEquipmentId = 2 },
                new Order { Id = 3, OrderNumber = "ORD-2026-003", ProductName = "Technic Gear 16 Tooth", QuantityRequested = 30000, QuantityProduced = 0, CreatedAt = now.AddDays(-1), ScheduledStartTime = now.AddHours(1), EstimatedEndTime = now.AddHours(6), Status = OrderStatus.Scheduled, Priority = OrderPriority.Normal, AssignedEquipmentId = 3 },
                new Order { Id = 4, OrderNumber = "ORD-2026-004", ProductName = "Minifig Head", QuantityRequested = 25000, QuantityProduced = 0, CreatedAt = now.AddDays(-1), ScheduledStartTime = now.AddHours(2), EstimatedEndTime = now.AddHours(7), Status = OrderStatus.Scheduled, Priority = OrderPriority.Low, AssignedEquipmentId = 6 },
                new Order { Id = 5, OrderNumber = "ORD-2026-005", ProductName = "Plate 2x2", QuantityRequested = 100000, QuantityProduced = 75000, CreatedAt = now.AddDays(-3), ScheduledStartTime = now.AddHours(-5), EstimatedEndTime = now.AddHours(3), ActualStartTime = now.AddHours(-4), Status = OrderStatus.InProgress, Priority = OrderPriority.Critical, AssignedEquipmentId = 9 },
                new Order { Id = 6, OrderNumber = "ORD-2026-006", ProductName = "Slope Brick 45", QuantityRequested = 35000, QuantityProduced = 33000, CreatedAt = now.AddDays(-2), ScheduledStartTime = now.AddHours(-3), EstimatedEndTime = now.AddHours(2), ActualStartTime = now.AddHours(-2), Status = OrderStatus.InProgress, Priority = OrderPriority.High, AssignedEquipmentId = 10 },
                new Order { Id = 7, OrderNumber = "ORD-2026-007", ProductName = "Window Frame 1x2x2", QuantityRequested = 20000, QuantityProduced = 18000, CreatedAt = now.AddDays(-1), ScheduledStartTime = now.AddHours(-2), EstimatedEndTime = now.AddHours(3), ActualStartTime = now.AddHours(-1), Status = OrderStatus.InProgress, Priority = OrderPriority.Normal, AssignedEquipmentId = 11 },
                new Order { Id = 8, OrderNumber = "ORD-2026-008", ProductName = "Wheel Rim", QuantityRequested = 15000, QuantityProduced = 0, CreatedAt = now.AddHours(-6), ScheduledStartTime = now.AddHours(3), EstimatedEndTime = now.AddHours(8), Status = OrderStatus.Scheduled, Priority = OrderPriority.Normal, AssignedEquipmentId = 14 },
                new Order { Id = 9, OrderNumber = "ORD-2026-009", ProductName = "Baseplate Green", QuantityRequested = 5000, QuantityProduced = 0, CreatedAt = now.AddHours(-4), ScheduledStartTime = now.AddHours(4), EstimatedEndTime = now.AddHours(9), Status = OrderStatus.Scheduled, Priority = OrderPriority.Low, AssignedEquipmentId = 17 },
                new Order { Id = 10, OrderNumber = "ORD-2026-010", ProductName = "Tile 1x1", QuantityRequested = 80000, QuantityProduced = 65000, CreatedAt = now.AddDays(-2), ScheduledStartTime = now.AddHours(-4), EstimatedEndTime = now.AddHours(4), ActualStartTime = now.AddHours(-3), Status = OrderStatus.InProgress, Priority = OrderPriority.High, AssignedEquipmentId = 19 },
            };

            context.Orders.AddRange(orders);
            context.SaveChanges();
        }
    }
}

