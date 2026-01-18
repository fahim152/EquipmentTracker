using EquipmentTracker.Domain.Enum;

namespace EquipmentTracker.Domain.Model
{
    public class Equipment
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public EquipmentState CurrentState { get; set; }
    }
}

