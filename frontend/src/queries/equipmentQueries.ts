import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { equipmentApi } from '../api/equipmentApi';
import { Equipment, EquipmentStateChange, EquipmentState } from '../types/equipment';

export const equipmentKeys = {
  all: ['equipment'] as const,
  lists: () => [...equipmentKeys.all, 'list'] as const,
  details: () => [...equipmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...equipmentKeys.details(), id] as const,
  history: (id: number) => [...equipmentKeys.all, 'history', id] as const,
  allHistory: () => [...equipmentKeys.all, 'history'] as const,
  status: (id: number) => [...equipmentKeys.all, 'status', id] as const,
};

export const useEquipment = (): UseQueryResult<Equipment[], Error> => {
  return useQuery({
    queryKey: equipmentKeys.lists(),
    queryFn: equipmentApi.getAllEquipment,
  });
};


export const useEquipmentDetail = (id: number): UseQueryResult<Equipment, Error> => {
  return useQuery({
    queryKey: equipmentKeys.detail(id),
    queryFn: () => equipmentApi.getEquipmentById(id),
    enabled: !!id,
  });
};

export const useEquipmentHistory = (id: number): UseQueryResult<EquipmentStateChange[], Error> => {
  return useQuery({
    queryKey: equipmentKeys.history(id),
    queryFn: () => equipmentApi.getEquipmentHistory(id),
    enabled: !!id,
  });
};

export const useAllHistory = (): UseQueryResult<EquipmentStateChange[], Error> => {
  return useQuery({
    queryKey: equipmentKeys.allHistory(),
    queryFn: equipmentApi.getAllHistory,
  });
};

export const useLatestStatus = (id: number): UseQueryResult<EquipmentStateChange, Error> => {
  return useQuery({
    queryKey: equipmentKeys.status(id),
    queryFn: () => equipmentApi.getLatestStatus(id),
    enabled: !!id,
  });
};

export const useChangeEquipmentState = (): UseMutationResult<
  EquipmentStateChange,
  Error,
  { id: number; newState: EquipmentState }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: equipmentApi.changeEquipmentState,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: equipmentKeys.lists() });
      await queryClient.cancelQueries({ queryKey: equipmentKeys.detail(variables.id) });

      const previousEquipmentList = queryClient.getQueryData<Equipment[]>(equipmentKeys.lists());
      const previousEquipmentDetail = queryClient.getQueryData<Equipment>(equipmentKeys.detail(variables.id));

      queryClient.setQueryData<Equipment[]>(equipmentKeys.lists(), (old) => {
        if (!old) return old;
        return old.map((equipment) =>
          equipment.id === variables.id
            ? { ...equipment, currentState: variables.newState }
            : equipment
        );
      });

      queryClient.setQueryData<Equipment>(equipmentKeys.detail(variables.id), (old) => {
        if (!old) return old;
        return { ...old, currentState: variables.newState };
      });

      return { previousEquipmentList, previousEquipmentDetail };
    },
    onError: (error, variables, context) => {
      if (context?.previousEquipmentList) {
        queryClient.setQueryData(equipmentKeys.lists(), context.previousEquipmentList);
      }
      if (context?.previousEquipmentDetail) {
        queryClient.setQueryData(equipmentKeys.detail(variables.id), context.previousEquipmentDetail);
      }
      queryClient.invalidateQueries({ queryKey: equipmentKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() });
    },
  });
};

