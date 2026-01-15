using EquipmentTracker.Domain.Model;
using EquipmentTracker.Repositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EquipmentTracker.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IEquipmentRepository _equipmentRepository;
        private readonly ILogger<OrderService> _logger;

        public OrderService(
            IOrderRepository orderRepository,
            IEquipmentRepository equipmentRepository,
            ILogger<OrderService> logger)
        {
            _orderRepository = orderRepository;
            _equipmentRepository = equipmentRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<Order>> GetAllOrdersAsync()
        {
            return await _orderRepository.GetAllAsync();
        }

        public async Task<Order?> GetOrderByIdAsync(int id)
        {
            return await _orderRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Order>> GetOrdersByEquipmentIdAsync(int equipmentId)
        {
            return await _orderRepository.GetOrdersByEquipmentIdAsync(equipmentId);
        }

        public async Task<IEnumerable<Order>> GetOrdersByStatusAsync(OrderStatus status)
        {
            return await _orderRepository.GetOrdersByStatusAsync(status);
        }


        public async Task<IEnumerable<ScheduledOrder>> GetScheduledOrdersByEquipmentIdAsync(int equipmentId)
        {
            return await _orderRepository.GetScheduledOrdersByEquipmentIdAsync(equipmentId);
        }

        public async Task<IEnumerable<ScheduledOrder>> GetAllScheduledOrdersAsync()
        {
            return await _orderRepository.GetAllScheduledOrdersAsync();
        }

        public async Task<Order> CreateOrderAsync(Order order)
        {
            if (order.AssignedEquipmentId.HasValue && order.ScheduledStartTime.HasValue)
            {
                var existingOrders = await _orderRepository.GetOrdersByEquipmentIdAsync(order.AssignedEquipmentId.Value);
                
                var estimatedEndTime = order.ScheduledStartTime.Value.AddHours(2);
                
                foreach (var existingOrder in existingOrders)
                {
                    if (existingOrder.Id == order.Id) continue;
                    
                    if (existingOrder.ScheduledStartTime.HasValue && 
                        (existingOrder.Status == OrderStatus.Scheduled || existingOrder.Status == OrderStatus.Pending))
                    {
                        var existingEndTime = existingOrder.ScheduledStartTime.Value.AddHours(2);
                        
                        bool hasOverlap = (order.ScheduledStartTime.Value < existingEndTime) && 
                                         (estimatedEndTime > existingOrder.ScheduledStartTime.Value);
                        
                        if (hasOverlap)
                        {
                            throw new InvalidOperationException(
                                $"Cannot schedule order: Equipment is already scheduled for another order ({existingOrder.OrderNumber}) " +
                                $"from {existingOrder.ScheduledStartTime.Value:yyyy-MM-dd HH:mm} to {existingEndTime:yyyy-MM-dd HH:mm}. " +
                                $"Please choose a different time slot."
                            );
                        }
                    }
                }
            }
            
            order.CreatedAt = DateTime.UtcNow;
            order.Status = OrderStatus.Pending;
            return await _orderRepository.CreateOrderAsync(order);
        }

        public async Task UpdateOrderAsync(Order order)
        {
            if (order.AssignedEquipmentId.HasValue && order.ScheduledStartTime.HasValue)
            {
                var existingOrders = await _orderRepository.GetOrdersByEquipmentIdAsync(order.AssignedEquipmentId.Value);
                
                var estimatedEndTime = order.ScheduledStartTime.Value.AddHours(2);
                
                foreach (var existingOrder in existingOrders)
                {
                    if (existingOrder.Id == order.Id) continue;
                    
                    if (existingOrder.ScheduledStartTime.HasValue && 
                        (existingOrder.Status == OrderStatus.Scheduled || existingOrder.Status == OrderStatus.Pending))
                    {
                        var existingEndTime = existingOrder.ScheduledStartTime.Value.AddHours(2);
                        
                        bool hasOverlap = (order.ScheduledStartTime.Value < existingEndTime) && 
                                         (estimatedEndTime > existingOrder.ScheduledStartTime.Value);
                        
                        if (hasOverlap)
                        {
                            throw new InvalidOperationException(
                                $"Cannot update order: Equipment is already scheduled for another order ({existingOrder.OrderNumber}) " +
                                $"from {existingOrder.ScheduledStartTime.Value:yyyy-MM-dd HH:mm} to {existingEndTime:yyyy-MM-dd HH:mm}. " +
                                $"Please choose a different time slot."
                            );
                        }
                    }
                }
            }
            
            await _orderRepository.UpdateOrderAsync(order);
        }

        public async Task DeleteOrderAsync(int id)
        {
            await _orderRepository.DeleteOrderAsync(id);
        }
    }
}

