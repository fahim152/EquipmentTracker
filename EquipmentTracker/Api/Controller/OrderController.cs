using EquipmentTracker.Domain.DTOs;
using EquipmentTracker.Domain.Enum;
using EquipmentTracker.Domain.Model;
using EquipmentTracker.Services;
using Microsoft.AspNetCore.Mvc;


namespace EquipmentTracker.Api.Controller
{
    [ApiController]
    [Route("[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public async Task<IEnumerable<Order>> GetAll()
        {
            return await _orderService.GetAllOrdersAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> Get(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null)
                return NotFound();
            return order;
        }

        [HttpGet("equipment/{equipmentId}")]
        public async Task<IEnumerable<Order>> GetByEquipment(int equipmentId)
        {
            return await _orderService.GetOrdersByEquipmentIdAsync(equipmentId);
        }

        [HttpGet("status/{status}")]
        public async Task<IEnumerable<Order>> GetByStatus(OrderStatus status)
        {
            return await _orderService.GetOrdersByStatusAsync(status);
        }
   
        [HttpGet("scheduled")]
        public async Task<IEnumerable<Order>> GetAllScheduled()
        {
            return await _orderService.GetAllScheduledOrdersAsync();
        }

        [HttpGet("scheduled/equipment/{equipmentId}")]
        public async Task<IEnumerable<Order>> GetScheduledByEquipment(int equipmentId)
        {
            return await _orderService.GetScheduledOrdersByEquipmentIdAsync(equipmentId);
        }

        [HttpPost]
        public async Task<ActionResult<Order>> Create([FromBody] CreateOrderDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var order = new Order
                {
                    OrderNumber = dto.OrderNumber,
                    ProductName = dto.ProductName,
                    QuantityRequested = dto.QuantityRequested,
                    Priority = dto.Priority,
                    ScheduledStartTime = dto.ScheduledStartTime,
                    EstimatedEndTime = dto.EstimatedEndTime,
                    AssignedEquipmentId = dto.AssignedEquipmentId,
                    QuantityProduced = 0
                };

                var createdOrder = await _orderService.CreateOrderAsync(order);
                return CreatedAtAction(nameof(Get), new { id = createdOrder.Id }, createdOrder);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateOrderDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var order = await _orderService.GetOrderByIdAsync(id);
                if (order == null)
                {
                    return NotFound();
                }

                order.OrderNumber = dto.OrderNumber;
                order.ProductName = dto.ProductName;
                order.QuantityRequested = dto.QuantityRequested;
                order.Priority = dto.Priority;
                order.ScheduledStartTime = dto.ScheduledStartTime;
                order.EstimatedEndTime = dto.EstimatedEndTime;

                await _orderService.UpdateOrderAsync(order);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _orderService.DeleteOrderAsync(id);
            return NoContent();
        }
    }

}

