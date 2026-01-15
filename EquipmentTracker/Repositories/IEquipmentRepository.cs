using EquipmentTracker.Domain.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EquipmentTracker.Repositories
{
    public interface IEquipmentRepository
    {
        Task<Equipment?> GetByIdAsync(int id);
        Task<IEnumerable<Equipment>> GetAllAsync();
        Task AddStateChangeAsync(EquipmentStateChange stateChange);
        Task<IEnumerable<EquipmentStateChange>> GetStateChangeHistoryAsync();
        Task<IEnumerable<EquipmentStateChange>> GetStateChangeHistoryByEquipmentIdAsync(int equipmentId);
        Task<EquipmentStateChange?> GetLatestStateChangeByEquipmentIdAsync(int equipmentId);
        Task UpdateEquipmentStateAsync(int equipmentId, EquipmentState newState);
    }
}

