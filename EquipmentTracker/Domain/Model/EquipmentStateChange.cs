using System;

namespace EquipmentTracker.Domain.Model
{
    public class EquipmentStateChange
    {
        public Guid Id { get; set; }
        public int EquipmentId { get; set; }
        public EquipmentState State { get; set; }
        public DateTime Timestamp { get; set; }
        public Guid ChangedById { get; set; }
    }
}

