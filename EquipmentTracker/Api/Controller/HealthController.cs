using EquipmentTracker.Domain.Model;
using EquipmentTracker.Data;
using EquipmentTracker.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EquipmentTracker.Api.Controller
{
    [ApiController]
    [Route("[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly EquipmentDbContext _context;
        private readonly IEventPublisher _eventPublisher;
        private readonly IConfiguration _configuration;

        public HealthController(
            EquipmentDbContext context,
            IEventPublisher eventPublisher,
            IConfiguration configuration)
        {
            _context = context;
            _eventPublisher = eventPublisher;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<ActionResult<HealthCheckResponse>> GetHealth()
        {
            var response = new HealthCheckResponse
            {
                Timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
            };

            await CheckDatabase(response);
            CheckPulsar(response);
            CheckSignalR(response);

            if (!response.Database.IsHealthy || !response.Pulsar.IsHealthy)
            {
                response.Status = "Degraded";
            }

            return Ok(response);
        }

        private async Task CheckDatabase(HealthCheckResponse response)
        {
            try
            {
                // use canConnect or a simple query to verify database connectivity ?  
                var count = await _context.Equipment.CountAsync();
                response.Database.IsHealthy = true;
                response.Database.Message = "Database connection successful";
                response.Database.EquipmentCount = count;
            }
            catch (Exception ex)
            {
                response.Database.IsHealthy = false;
                response.Database.Message = $"Database error: {ex.Message}";
            }
        }

        private void CheckPulsar(HealthCheckResponse response)
        {
            var pulsarUrl = _configuration["PulsarUrl"] ?? "pulsar://localhost:6650";
            response.Pulsar.Url = pulsarUrl;

            try
            {
                if (_eventPublisher != null)
                {
                    response.Pulsar.IsHealthy = true;
                    response.Pulsar.Message = "Pulsar service initialized";
                }
                else
                {
                    response.Pulsar.IsHealthy = false;
                    response.Pulsar.Message = "Pulsar service not available";
                }
            }
            catch (Exception ex)
            {
                response.Pulsar.IsHealthy = false;
                response.Pulsar.Message = $"Pulsar error: {ex.Message}";
            }
        }

        private void CheckSignalR(HealthCheckResponse response)
        {
            try
            {
                response.SignalR.IsHealthy = true;
                response.SignalR.Message = "SignalR hub available";
                response.SignalR.ConnectedClients = 0;
            }
            catch (Exception ex)
            {
                response.SignalR.IsHealthy = false;
                response.SignalR.Message = $"SignalR error: {ex.Message}";
            }
        }
    }
}

