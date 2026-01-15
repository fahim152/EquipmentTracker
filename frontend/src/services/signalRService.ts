import * as signalR from '@microsoft/signalr';
import { EquipmentStateChangedMessage } from '../types/equipment';

const SIGNALR_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/hubs/equipment';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private listeners: Map<string, ((data: EquipmentStateChangedMessage) => void)[]> = new Map();
  private isStarting = false;

  async start() {
    if (this.connection || this.isStarting) {
      return;
    }

    this.isStarting = true;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_URL, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount < 3) {
            return 2000;
          } else if (retryContext.previousRetryCount < 6) {
            return 5000;
          }
          return 10000;
        }
      })
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.connection.on('EquipmentStateChanged', (data: EquipmentStateChangedMessage) => {
      const callbacks = this.listeners.get('EquipmentStateChanged') || [];
      callbacks.forEach((callback) => callback(data));
    });

    this.connection.onreconnecting(() => {
      console.log('SignalR reconnecting...');
    });

    this.connection.onreconnected(() => {
      console.log('SignalR reconnected');
    });

    this.connection.onclose(() => {
      this.connection = null;
      this.isStarting = false;
      setTimeout(() => this.start(), 5000);
    });

    try {
      await this.connection.start();
      this.isStarting = false;
      console.log('SignalR connected');
    } catch (error) {
      this.connection = null;
      this.isStarting = false;
      console.warn('SignalR connection failed, will retry...', error);
      setTimeout(() => this.start(), 5000);
    }
  }

  on(event: string, callback: (data: EquipmentStateChangedMessage) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: (data: EquipmentStateChangedMessage) => void) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  async stop() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.listeners.clear();
      this.isStarting = false;
    }
  }
}

export const signalRService = new SignalRService();

