using System.Text.Json.Serialization;

namespace EquipmentTracker.Domain.DTOs
{
    public class HealthCheckResponse
    {
        public string Status { get; set; } = "Healthy";
        public long Timestamp { get; set; }
        public DatabaseHealth Database { get; set; } = new();
        public PulsarHealth Pulsar { get; set; } = new();
        public SignalRHealth SignalR { get; set; } = new();
    }

    public class DatabaseHealth
    {
        public bool IsHealthy { get; set; }
        public string Message { get; set; } = string.Empty;
        public int EquipmentCount { get; set; }
    }

    public class PulsarHealth
    {
        public bool IsHealthy { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
    }

    public class SignalRHealth
    {
        public bool IsHealthy { get; set; }
        public string Message { get; set; } = string.Empty;
        public int ConnectedClients { get; set; }
    }
}

