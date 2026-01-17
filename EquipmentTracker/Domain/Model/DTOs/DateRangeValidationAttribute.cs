using System.ComponentModel.DataAnnotations;

namespace EquipmentTracker.Domain.Model.DTOs
{
    public class DateRangeValidationAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var dto = validationContext.ObjectInstance;
            
            DateTime? scheduledStartTime;
            DateTime? estimatedEndTime;

            switch (dto)
            {
                case CreateOrderDto createDto:
                    scheduledStartTime = createDto.ScheduledStartTime;
                    estimatedEndTime = createDto.EstimatedEndTime;
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

            if (estimatedEndTime.HasValue && estimatedEndTime.Value < DateTime.UtcNow)
            {
                return new ValidationResult("Estimated end time cannot be in the past");
            }

            return ValidationResult.Success;
        }
    }
}

