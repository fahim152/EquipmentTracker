using EquipmentTracker.Domain.Enum;
using EquipmentTracker.Domain.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EquipmentTracker.Services
{
    public interface IEquipmentService
    {
        Task<IEnumerable<Equipment>> GetAllEquipmentAsync();
        Task<Equipment?> GetEquipmentByIdAsync(int id);
        Task<EquipmentStateChange?> ChangeEquipmentStateAsync(int equipmentId, EquipmentState newState);
        Task<IEnumerable<EquipmentStateChange>> GetStateChangeHistoryAsync();
        Task<IEnumerable<EquipmentStateChange>> GetEquipmentHistoryAsync(int equipmentId);
        Task<EquipmentStateChange?> GetLatestEquipmentStatusAsync(int equipmentId);
    }
}
