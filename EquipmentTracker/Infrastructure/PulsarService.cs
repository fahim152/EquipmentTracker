using DotPulsar;
using DotPulsar.Abstractions;
using DotPulsar.Extensions;
using EquipmentTracker.Services;

namespace EquipmentTracker.Infrastructure
{
    public class PulsarService : IEventPublisher
    {
        private const string TopicPrefix = "persistent://public/default/";
        private readonly IPulsarClient _client;

        public PulsarService(string serviceUrl)
        {
            _client = PulsarClient
                .Builder()
                .ServiceUrl(new Uri(serviceUrl))
                .Build();
        }

        public async Task PublishAsync(string topic, string message)
        {
            await using var producer = _client
                .NewProducer(Schema.String)
                .Topic(TopicPrefix + topic)
                .Create();

            await producer.Send(message);
        }
    }
}
