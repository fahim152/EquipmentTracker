import { Equipment, EquipmentStateChange, EquipmentState } from '../types/equipment';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const equipmentApi = {
  // Get all equipment (lightweight - no relations)
  getAllEquipment: async (): Promise<Equipment[]> => {
    const response = await fetch(`${API_BASE_URL}/equipment`);
    if (!response.ok) throw new Error('Failed to fetch equipment');
    return response.json();
  },

  // Get specific equipment by ID
  getEquipmentById: async (id: number): Promise<Equipment> => {
    const response = await fetch(`${API_BASE_URL}/equipment/${id}`);
    if (!response.ok) throw new Error('Failed to fetch equipment');
    return response.json();
  },

  // Change equipment state
  changeEquipmentState: async ({ id, newState }: { id: number; newState: EquipmentState }): Promise<EquipmentStateChange> => {
    const response = await fetch(`${API_BASE_URL}/equipment/${id}/state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newState),
    });
    if (!response.ok) throw new Error('Failed to change equipment state');
    return response.json();
  },

  // Get all state change history
  getAllHistory: async (): Promise<EquipmentStateChange[]> => {
    const response = await fetch(`${API_BASE_URL}/equipment/history`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return response.json();
  },

  // Get equipment-specific history
  getEquipmentHistory: async (id: number): Promise<EquipmentStateChange[]> => {
    const response = await fetch(`${API_BASE_URL}/equipment/${id}/history`);
    if (!response.ok) throw new Error('Failed to fetch equipment history');
    return response.json();
  },

  // Get latest status for equipment
  getLatestStatus: async (id: number): Promise<EquipmentStateChange> => {
    const response = await fetch(`${API_BASE_URL}/equipment/${id}/status`);
    if (!response.ok) throw new Error('Failed to fetch latest status');
    return response.json();
  },
};

