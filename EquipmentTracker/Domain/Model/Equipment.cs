using System;
using System.Collections.Generic;

namespace EquipmentTracker.Domain.Model
{
    public class Equipment
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public EquipmentState CurrentState { get; set; }
        public int? CurrentOrderId { get; set; }
        public Order? CurrentOrder { get; set; }
        public ICollection<ScheduledOrder>? ScheduledOrders { get; set; }
    }
}

