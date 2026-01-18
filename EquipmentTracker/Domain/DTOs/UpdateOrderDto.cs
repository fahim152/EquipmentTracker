using System;
using System.ComponentModel.DataAnnotations;
using EquipmentTracker.Domain.Enum;
using EquipmentTracker.Domain.ValidationAttribute;

namespace EquipmentTracker.Domain.DTOs
{
    [OrderScheduleValidation]
    public class UpdateOrderDto
    {
        [Required(ErrorMessage = "Order number is required")]
        [StringLength(100, ErrorMessage = "Order number cannot exceed 100 characters")]
        public string OrderNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Product name is required")]
        [StringLength(200, ErrorMessage = "Product name cannot exceed 200 characters")]
        public string ProductName { get; set; } = string.Empty;

        [Range(1, int.MaxValue, ErrorMessage = "Quantity requested must be greater than zero")]
        public int QuantityRequested { get; set; }

        public OrderPriority Priority { get; set; }

        public DateTime? ScheduledStartTime { get; set; }
        
        public DateTime? EstimatedEndTime { get; set; }
    }
}
