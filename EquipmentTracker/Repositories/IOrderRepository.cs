using EquipmentTracker.Domain.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EquipmentTracker.Repositories
{
    public interface IOrderRepository
    {
        Task<Order?> GetByIdAsync(int id);
        Task<IEnumerable<Order>> GetAllAsync();
        Task<IEnumerable<Order>> GetOrdersByEquipmentIdAsync(int equipmentId);
        Task<IEnumerable<Order>> GetOrdersByStatusAsync(OrderStatus status);
        Task<IEnumerable<ScheduledOrder>> GetScheduledOrdersByEquipmentIdAsync(int equipmentId);
        Task<IEnumerable<ScheduledOrder>> GetAllScheduledOrdersAsync();
        Task<Order> CreateOrderAsync(Order order);
        Task UpdateOrderAsync(Order order);
        Task DeleteOrderAsync(int id);
    }
}

