using System;
using EquipmentTracker.Domain.Model;

namespace EquipmentTracker.Services.Events
{
    public class EquipmentStateChangedMessage
    {
        public string Topic { get; init; } = string.Empty;
        public int EquipmentId { get; init; }
        public string EquipmentName { get; init; } = string.Empty;
        public EquipmentState State { get; init; }
        public string StateLabel { get; init; } = string.Empty;
        public DateTime Timestamp { get; init; }
        public Guid ChangedById { get; init; }
    }
}

