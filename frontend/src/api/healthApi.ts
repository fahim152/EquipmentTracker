export interface HealthCheckResponse {
  status: string;
  timestamp: number;
  database: {
    isHealthy: boolean;
    message: string;
    equipmentCount: number;
  };
  pulsar: {
    isHealthy: boolean;
    message: string;
    url: string;
  };
  signalR: {
    isHealthy: boolean;
    message: string;
    connectedClients: number;
  };
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const healthApi = {
  getHealth: async (): Promise<HealthCheckResponse> => {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error('Failed to fetch health status');
    return response.json();
  },
};

