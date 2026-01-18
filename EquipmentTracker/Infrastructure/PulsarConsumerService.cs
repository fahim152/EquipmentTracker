using System.Buffers;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.SignalR;
using DotPulsar;
using DotPulsar.Abstractions;
using DotPulsar.Extensions;
using EquipmentTracker.Hubs;
using EquipmentTracker.Domain.DTOs;

namespace EquipmentTracker.Infrastructure
{
    public class PulsarConsumerService : BackgroundService
    {
        private readonly IHubContext<EquipmentHub> _hubContext;
        private readonly ILogger<PulsarConsumerService> _logger;
        private readonly string _pulsarUrl;
        private IConsumer<ReadOnlySequence<byte>>? _consumer;
        private IPulsarClient? _client;

        public PulsarConsumerService(
            IHubContext<EquipmentHub> hubContext,
            IConfiguration configuration,
            ILogger<PulsarConsumerService> logger)
        {
            _hubContext = hubContext;
            _logger = logger;
            _pulsarUrl = configuration["PulsarUrl"] ?? "pulsar://localhost:6650";
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                _logger.LogInformation("Starting Pulsar consumer service connecting to {PulsarUrl}", _pulsarUrl);

                _client = PulsarClient.Builder()
                    .ServiceUrl(new Uri(_pulsarUrl))
                    .Build();

                _consumer = _client.NewConsumer()
                    .Topic("persistent://public/default/equipment-state-changes")
                    .SubscriptionName("signalr-broadcaster")
                    .Create();

                _logger.LogInformation("Successfully subscribed to Pulsar topic: equipment-state-changes");

                await ConsumeMessages(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to start Pulsar consumer service. Will continue without Pulsar...");
            }
        }

        private async Task ConsumeMessages(CancellationToken stoppingToken)
        {
            if (_consumer == null) return;

            await foreach (var message in _consumer.Messages(stoppingToken))
            {
                try
                {
                    var buffer = message.Data.ToArray();
                    var json = Encoding.UTF8.GetString(buffer);
                    _logger.LogInformation("Received message from Pulsar: {Message}", json);

                    var stateChangeMessage = JsonSerializer.Deserialize<EquipmentStateChangedMessage>(json, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (stateChangeMessage != null)
                    {
                        await _hubContext.Clients.All
                            .SendAsync("EquipmentStateChanged", stateChangeMessage, stoppingToken);
                        
                        _logger.LogInformation("Broadcasted equipment {EquipmentId} state change to SignalR clients", stateChangeMessage.EquipmentId);
                    }

                    await _consumer.Acknowledge(message, stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    _logger.LogInformation("Pulsar consumer service is stopping");
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing Pulsar message");
                }
            }
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Stopping Pulsar consumer service");
            
            if (_consumer != null)
            {
                await _consumer.DisposeAsync();
            }

            if (_client != null)
            {
                await _client.DisposeAsync();
            }

            await base.StopAsync(cancellationToken);
        }
    }
}

