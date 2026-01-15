using System.Threading.Tasks;

namespace EquipmentTracker.Services
{
    public interface IEventPublisher
    {
        Task PublishAsync(string topic, string message);
    }
}

