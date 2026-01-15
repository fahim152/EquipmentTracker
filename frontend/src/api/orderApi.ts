import { Order, OrderStatus, ScheduledOrder } from '../types/equipment';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const orderApi = {
  getAllOrders: async (): Promise<Order[]> => {
    const response = await fetch(`${API_BASE_URL}/order`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  getOrderById: async (id: number): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/order/${id}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  },

  getOrdersByEquipment: async (equipmentId: number): Promise<Order[]> => {
    const response = await fetch(`${API_BASE_URL}/order/equipment/${equipmentId}`);
    if (!response.ok) throw new Error('Failed to fetch orders by equipment');
    return response.json();
  },

  getOrdersByStatus: async (status: OrderStatus): Promise<Order[]> => {
    const response = await fetch(`${API_BASE_URL}/order/status/${status}`);
    if (!response.ok) throw new Error('Failed to fetch orders by status');
    return response.json();
  },

  createOrder: async (order: Partial<Order>): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create order');
    }
    return response.json();
  },

  updateOrder: async (id: number, orderData: Partial<Order>): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/order/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update order');
    }
  },

  deleteOrder: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/order/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete order');
  },

  startOrder: async (id: number): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/order/${id}/start`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to start order');
    return response.json();
  },

  completeOrder: async (id: number): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/order/${id}/complete`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to complete order');
    return response.json();
  },

  updateOrderProgress: async (id: number, quantityProduced: number): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/order/${id}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quantityProduced),
    });
    if (!response.ok) throw new Error('Failed to update order progress');
    return response.json();
  },

  getAllScheduledOrders: async (): Promise<ScheduledOrder[]> => {
    const response = await fetch(`${API_BASE_URL}/order/scheduled`);
    if (!response.ok) throw new Error('Failed to fetch scheduled orders');
    return response.json();
  },

  getScheduledOrdersByEquipment: async (equipmentId: number): Promise<ScheduledOrder[]> => {
    const response = await fetch(`${API_BASE_URL}/order/scheduled/equipment/${equipmentId}`);
    if (!response.ok) throw new Error('Failed to fetch scheduled orders');
    return response.json();
  },
};

