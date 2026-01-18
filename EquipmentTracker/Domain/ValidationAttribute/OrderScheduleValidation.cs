using System;
using System.ComponentModel.DataAnnotations;
using EquipmentTracker.Domain.DTOs;

namespace EquipmentTracker.Domain.ValidationAttribute
{
    public class OrderScheduleValidation : System.ComponentModel.DataAnnotations.ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var dto = validationContext.ObjectInstance;
            
            DateTime? scheduledStartTime;
            DateTime? estimatedEndTime;
            bool isCreate = false;

            switch (dto)
            {
                case CreateOrderDto createDto:
                    scheduledStartTime = createDto.ScheduledStartTime;
                    estimatedEndTime = createDto.EstimatedEndTime;
                    isCreate = true;
                    break;
                case UpdateOrderDto updateDto:
                    scheduledStartTime = updateDto.ScheduledStartTime;
                    estimatedEndTime = updateDto.EstimatedEndTime;
                    break;
                default:
                    return ValidationResult.Success;
            }

            if (scheduledStartTime.HasValue && estimatedEndTime.HasValue)
            {
                if (estimatedEndTime.Value <= scheduledStartTime.Value)
                {
                    return new ValidationResult("Estimated end time must be after the scheduled start time");
                }
            }

            if (isCreate && estimatedEndTime.HasValue && estimatedEndTime.Value < DateTime.UtcNow)
            {
                return new ValidationResult("Estimated end time cannot be in the past");
            }

            return ValidationResult.Success;
        }
    }
}
