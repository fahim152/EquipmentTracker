using EquipmentTracker.Domain.Enum;
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
        Task<IEnumerable<Order>> GetScheduledOrdersByEquipmentIdAsync(int equipmentId);
        Task<IEnumerable<Order>> GetAllScheduledOrdersAsync();
        Task<Order> CreateOrderAsync(Order order);
        Task UpdateOrderAsync(Order order);
        Task DeleteOrderAsync(int id);
    }
}

