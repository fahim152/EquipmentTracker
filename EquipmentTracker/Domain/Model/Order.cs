using System;
using System.Text.Json.Serialization;

namespace EquipmentTracker.Domain.Model
{
    public class Order
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public int QuantityRequested { get; set; }
        public int QuantityProduced { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ScheduledStartTime { get; set; }
        public DateTime? EstimatedEndTime { get; set; }
        public DateTime? ActualStartTime { get; set; }
        public DateTime? CompletedAt { get; set; }
        public OrderStatus Status { get; set; }
        public OrderPriority Priority { get; set; }
        public int? AssignedEquipmentId { get; set; }
        [JsonIgnore]
        public Equipment? AssignedEquipment { get; set; }
    }
}

