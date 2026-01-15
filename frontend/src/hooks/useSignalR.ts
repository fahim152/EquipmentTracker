import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { signalRService } from '../services/signalRService';
import { EquipmentStateChangedMessage, Equipment } from '../types/equipment';
import { equipmentKeys } from '../queries/equipmentQueries';

export const useSignalR = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    signalRService.start();

    const handleStateChange = (data: EquipmentStateChangedMessage) => {
      queryClient.setQueryData<Equipment[]>(equipmentKeys.lists(), (old) => {
        if (!old) return old;
        return old.map((equipment) =>
          equipment.id === data.equipmentId
            ? { ...equipment, currentState: data.state }
            : equipment
        );
      });

      queryClient.invalidateQueries({ 
        queryKey: equipmentKeys.lists(),
        refetchType: 'active'
      });
      queryClient.invalidateQueries({ 
        queryKey: equipmentKeys.detail(data.equipmentId),
        refetchType: 'active'
      });
      queryClient.invalidateQueries({ 
        queryKey: equipmentKeys.history(data.equipmentId),
        refetchType: 'active'
      });

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Equipment Status Changed', {
          body: `${data.equipmentName} is now ${data.stateLabel}`,
          icon: '/favicon.ico',
        });
      }
    };

    signalRService.on('EquipmentStateChanged', handleStateChange);

    return () => {
      signalRService.off('EquipmentStateChanged', handleStateChange);
    };
  }, [queryClient]);
};

