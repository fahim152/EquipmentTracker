using EquipmentTracker.Domain.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EquipmentTracker.Services
{
    public interface IOrderService
    {
        Task<IEnumerable<Order>> GetAllOrdersAsync();
        Task<Order?> GetOrderByIdAsync(int id);
        Task<IEnumerable<Order>> GetOrdersByEquipmentIdAsync(int equipmentId);
        Task<IEnumerable<Order>> GetOrdersByStatusAsync(OrderStatus status);
        Task<IEnumerable<ScheduledOrder>> GetScheduledOrdersByEquipmentIdAsync(int equipmentId);
        Task<IEnumerable<ScheduledOrder>> GetAllScheduledOrdersAsync();
        Task<Order> CreateOrderAsync(Order order);
        Task UpdateOrderAsync(Order order);
        Task DeleteOrderAsync(int id);
    }
}

