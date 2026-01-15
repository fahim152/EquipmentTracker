using EquipmentTracker.Domain.Model;
using EquipmentTracker.Services;
using Microsoft.AspNetCore.Mvc;

namespace EquipmentTracker.Api.Controller
{
    [ApiController]
    [Route("[controller]")]
    public class EquipmentController : ControllerBase
    {
        private readonly IEquipmentService _equipmentService;

        public EquipmentController(IEquipmentService equipmentService)
        {
            _equipmentService = equipmentService;
        }

        [HttpGet]
        public async Task<IEnumerable<Equipment>> Get()
        {
            return await _equipmentService.GetAllEquipmentAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Equipment>> Get(int id)
        {
            var equipment = await _equipmentService.GetEquipmentByIdAsync(id);
            if (equipment == null)
            {
                return NotFound();
            }
            return equipment;
        }

        [HttpPost("{id}/state")]
        public async Task<IActionResult> ChangeState(int id, [FromBody] EquipmentState newState)
        {
            var stateChange = await _equipmentService.ChangeEquipmentStateAsync(id, newState);
            if (stateChange == null)
                return NotFound();

            return Ok(stateChange);
        }

        [HttpGet("history")]
        public async Task<IEnumerable<EquipmentStateChange>> GetHistory()
        {
            return await _equipmentService.GetStateChangeHistoryAsync();
        }

        [HttpGet("{id}/history")]
        public async Task<IEnumerable<EquipmentStateChange>> GetEquipmentHistory(int id)
        {
            return await _equipmentService.GetEquipmentHistoryAsync(id);
        }

        [HttpGet("{id}/status")]
        public async Task<ActionResult<EquipmentStateChange>> GetLatestStatus(int id)
        {
            var latestStatus = await _equipmentService.GetLatestEquipmentStatusAsync(id);
            if (latestStatus == null)
                return NotFound();
            
            return latestStatus;
        }
    }
}
