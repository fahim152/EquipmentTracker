using EquipmentTracker.Data;
using EquipmentTracker.Domain.Model;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EquipmentTracker.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly EquipmentDbContext _context;

        public OrderRepository(EquipmentDbContext context)
        {
            _context = context;
        }

        public async Task<Order?> GetByIdAsync(int id)
        {
            return await _context.Orders
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<IEnumerable<Order>> GetAllAsync()
        {
            return await _context.Orders
                .AsNoTracking()
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetOrdersByEquipmentIdAsync(int equipmentId)
        {
            return await _context.Orders
                .AsNoTracking()
                .Where(o => o.AssignedEquipmentId == equipmentId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetOrdersByStatusAsync(OrderStatus status)
        {
            return await _context.Orders
                .AsNoTracking()
                .Where(o => o.Status == status)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }


        public async Task<IEnumerable<ScheduledOrder>> GetScheduledOrdersByEquipmentIdAsync(int equipmentId)
        {
            return await _context.ScheduledOrders
                .Include(so => so.Order)
                .AsNoTracking()
                .Where(so => so.EquipmentId == equipmentId)
                .OrderBy(so => so.SequenceNumber)
                .ToListAsync();
        }

        public async Task<IEnumerable<ScheduledOrder>> GetAllScheduledOrdersAsync()
        {
            return await _context.ScheduledOrders
                .Include(so => so.Order)
                .AsNoTracking()
                .OrderBy(so => so.EquipmentId)
                .ThenBy(so => so.SequenceNumber)
                .ToListAsync();
        }

        public async Task<Order> CreateOrderAsync(Order order)
        {
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task UpdateOrderAsync(Order order)
        {
            var existingOrder = await _context.Orders.FindAsync(order.Id);
            if (existingOrder != null)
            {
                existingOrder.OrderNumber = order.OrderNumber;
                existingOrder.ProductName = order.ProductName;
                existingOrder.QuantityRequested = order.QuantityRequested;
                existingOrder.QuantityProduced = order.QuantityProduced;
                existingOrder.ScheduledStartTime = order.ScheduledStartTime;
                existingOrder.Priority = order.Priority;
                existingOrder.AssignedEquipmentId = order.AssignedEquipmentId;
                
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteOrderAsync(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order != null)
            {
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
            }
        }
    }
}

