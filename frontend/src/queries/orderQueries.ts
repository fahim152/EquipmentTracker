import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { orderApi } from '../api/orderApi';
import { Order, OrderStatus } from '../types/equipment';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
  byEquipment: (equipmentId: number) => [...orderKeys.all, 'equipment', equipmentId] as const,
  byStatus: (status: OrderStatus) => [...orderKeys.all, 'status', status] as const,
  scheduled: () => [...orderKeys.all, 'scheduled'] as const,
  scheduledByEquipment: (equipmentId: number) => [...orderKeys.scheduled(), 'equipment', equipmentId] as const,
};

export const useOrders = (): UseQueryResult<Order[], Error> => {
  return useQuery({
    queryKey: orderKeys.lists(),
    queryFn: orderApi.getAllOrders,
  });
};

export const useOrdersByEquipment = (equipmentId: number): UseQueryResult<Order[], Error> => {
  return useQuery({
    queryKey: orderKeys.byEquipment(equipmentId),
    queryFn: () => orderApi.getOrdersByEquipment(equipmentId),
    enabled: !!equipmentId,
  });
};

export const useScheduledOrders = (): UseQueryResult<Order[], Error> => {
  return useQuery({
    queryKey: orderKeys.scheduled(),
    queryFn: orderApi.getAllScheduledOrders,
  });
};

export const useScheduledOrdersByEquipment = (equipmentId: number): UseQueryResult<Order[], Error> => {
  return useQuery({
    queryKey: orderKeys.scheduledByEquipment(equipmentId),
    queryFn: () => orderApi.getScheduledOrdersByEquipment(equipmentId),
    enabled: !!equipmentId,
  });
};

