using EquipmentTracker.Domain.Model;
using EquipmentTracker.Repositories;
using EquipmentTracker.Services.Events;
using EquipmentTracker.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EquipmentTracker.Services
{
    public class EquipmentService : IEquipmentService
    {
        private static readonly Guid TestUserId = new Guid("00000000-0000-0000-0000-000000000001");
        private readonly IEventPublisher _eventPublisher;
        private readonly IEquipmentRepository _equipmentRepository;
        private readonly IHubContext<EquipmentHub> _hubContext;
        private readonly ILogger<EquipmentService> _logger;

        public EquipmentService(
            IEventPublisher eventPublisher, 
            IEquipmentRepository equipmentRepository,
            IHubContext<EquipmentHub> hubContext,
            ILogger<EquipmentService> logger)
        {
            _eventPublisher = eventPublisher;
            _equipmentRepository = equipmentRepository;
            _hubContext = hubContext;
            _logger = logger;
        }

        public async Task<IEnumerable<Equipment>> GetAllEquipmentAsync()
        {
            return await _equipmentRepository.GetAllAsync();
        }


        public async Task<Equipment?> GetEquipmentByIdAsync(int id)
        {
            return await _equipmentRepository.GetByIdAsync(id);
        }

        public async Task<EquipmentStateChange?> ChangeEquipmentStateAsync(int equipmentId, EquipmentState newState)
        {
            var equipment = await _equipmentRepository.GetByIdAsync(equipmentId);
            if (equipment == null)
                return null;

            var equipmentName = equipment.Name;

            var stateChange = new EquipmentStateChange
            {
                Id = Guid.NewGuid(),
                EquipmentId = equipmentId,
                State = newState,
                Timestamp = DateTime.UtcNow,
                ChangedById = TestUserId
            };

            await _equipmentRepository.AddStateChangeAsync(stateChange);
            await _equipmentRepository.UpdateEquipmentStateAsync(equipmentId, newState);

            var payload = new EquipmentStateChangedMessage
            {
                Topic = "equipment-state-changes",
                EquipmentId = stateChange.EquipmentId,
                EquipmentName = equipmentName,
                State = stateChange.State,
                StateLabel = stateChange.State.ToString(),
                Timestamp = stateChange.Timestamp,
                ChangedById = stateChange.ChangedById
            };

            await _hubContext.Clients.All.SendAsync("EquipmentStateChanged", payload);
            _logger.LogInformation("Broadcasted equipment {EquipmentId} state change to SignalR clients", equipmentId);

            _ = Task.Run(async () =>
            {
                try
                {
                    var message = JsonConvert.SerializeObject(payload);
                    await _eventPublisher.PublishAsync(payload.Topic, message);
                    _logger.LogInformation("Successfully published event to Pulsar for equipment {EquipmentId}", equipmentId);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to publish event to Pulsar for equipment {EquipmentId}. Database update succeeded.", equipmentId);
                }
            });

            return stateChange;
        }

        public async Task<IEnumerable<EquipmentStateChange>> GetStateChangeHistoryAsync()
        {
            return await _equipmentRepository.GetStateChangeHistoryAsync();
        }

        public async Task<IEnumerable<EquipmentStateChange>> GetEquipmentHistoryAsync(int equipmentId)
        {
            return await _equipmentRepository.GetStateChangeHistoryByEquipmentIdAsync(equipmentId);
        }

        public async Task<EquipmentStateChange?> GetLatestEquipmentStatusAsync(int equipmentId)
        {
            return await _equipmentRepository.GetLatestStateChangeByEquipmentIdAsync(equipmentId);
        }
    }
}
