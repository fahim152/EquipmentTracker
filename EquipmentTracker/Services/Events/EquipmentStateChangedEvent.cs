using System;
using EquipmentTracker.Domain.Model;

namespace EquipmentTracker.Services.Events
{
    public class EquipmentStateChangedEvent
    {
        public int EquipmentId { get; }
        public EquipmentState State { get; }
        public DateTime Timestamp { get; }
        public Guid ChangedById { get; }

        public EquipmentStateChangedEvent(int equipmentId, EquipmentState state, DateTime timestamp, Guid changedById)
        {
            EquipmentId = equipmentId;
            State = state;
            Timestamp = timestamp;
            ChangedById = changedById;
        }
    }
}

