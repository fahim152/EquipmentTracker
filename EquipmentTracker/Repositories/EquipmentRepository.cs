using EquipmentTracker.Data;
using EquipmentTracker.Domain.Model;
using Microsoft.EntityFrameworkCore;


namespace EquipmentTracker.Repositories
{
    public class EquipmentRepository : IEquipmentRepository
    {
        private readonly EquipmentDbContext _context;

        public EquipmentRepository(EquipmentDbContext context)
        {
            _context = context;
        }

        public async Task<Equipment?> GetByIdAsync(int id)
        {
            return await _context.Equipment
                .Include(e => e.CurrentOrder)
                .Include(e => e.ScheduledOrders)
                    .ThenInclude(so => so.Order)
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<IEnumerable<Equipment>> GetAllAsync()
        {
            return await _context.Equipment
                .Include(e => e.CurrentOrder)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task AddStateChangeAsync(EquipmentStateChange stateChange)
        {
            await _context.EquipmentStateChanges.AddAsync(stateChange);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<EquipmentStateChange>> GetStateChangeHistoryAsync()
        {
            return await _context.EquipmentStateChanges.ToListAsync();
        }

        public async Task<IEnumerable<EquipmentStateChange>> GetStateChangeHistoryByEquipmentIdAsync(int equipmentId)
        {
            return await _context.EquipmentStateChanges
                .Where(sc => sc.EquipmentId == equipmentId)
                .OrderByDescending(sc => sc.Timestamp)
                .ToListAsync();
        }

        public async Task<EquipmentStateChange?> GetLatestStateChangeByEquipmentIdAsync(int equipmentId)
        {
            return await _context.EquipmentStateChanges
                .Where(sc => sc.EquipmentId == equipmentId)
                .OrderByDescending(sc => sc.Timestamp)
                .FirstOrDefaultAsync();
        }


        public async Task UpdateEquipmentStateAsync(int equipmentId, EquipmentState newState)
        {
            var equipment = await _context.Equipment.FindAsync(equipmentId);
            if (equipment != null)
            {
                equipment.CurrentState = newState;
                await _context.SaveChangesAsync();
            }
        }
    }
}

