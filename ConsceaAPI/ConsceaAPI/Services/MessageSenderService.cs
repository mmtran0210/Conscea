using Azure.Messaging.ServiceBus;
using System.Text;
using static ConsceaAPI.Helpers.Constants;

namespace ConsceaAPI.Services;

public class MessageSenderService
{
    private readonly IConfiguration _config;

    // Service bus client
    private ServiceBusClient _client;

    public MessageSenderService(IConfiguration config)
    {
        _config = config;
        _client = new ServiceBusClient(_config[ConfigKey.ServiceBusConnectionString]);
    }

    // Send a message to a service bus queue
    public async Task SendMessageAsync(string queueName, string message)
    {
        // Create a sender for the queue
        var sender = _client.CreateSender(queueName);

        // Create a message that we can send
        var busMessage = new ServiceBusMessage(Encoding.UTF8.GetBytes(message));

        // Send the message
        await sender.SendMessageAsync(busMessage);
    }
}
