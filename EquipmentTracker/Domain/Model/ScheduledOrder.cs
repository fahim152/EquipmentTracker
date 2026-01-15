using System;
using System.Text.Json.Serialization;

namespace EquipmentTracker.Domain.Model
{
    public class ScheduledOrder
    {
        public int Id { get; set; }
        public int EquipmentId { get; set; }
        public int OrderId { get; set; }
        public int SequenceNumber { get; set; }
        public DateTime ScheduledStartTime { get; set; }
        public DateTime EstimatedEndTime { get; set; }
        public Equipment? Equipment { get; set; }
        public Order? Order { get; set; }
    }
}

