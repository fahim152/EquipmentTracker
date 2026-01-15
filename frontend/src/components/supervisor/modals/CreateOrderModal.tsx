import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '../../../api/orderApi';
import { EquipmentState, OrderPriority } from '../../../types/equipment';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentId: number;
  equipmentName: string;
  equipmentState: EquipmentState;
}

interface OrderFormData {
  orderNumber: string;
  productName: string;
  quantityRequested: number;
  priority: OrderPriority;
  scheduledStartTime: string;
  estimatedEndTime: string;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  equipmentId,
  equipmentName,
  equipmentState,
}) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [showWarning, setShowWarning] = useState(true);

  const [formData, setFormData] = useState<OrderFormData>({
    orderNumber: '',
    productName: '',
    quantityRequested: 0,
    priority: OrderPriority.Normal,
    scheduledStartTime: '',
    estimatedEndTime: '',
  });

  const createOrderMutation = useMutation({
    mutationFn: (data: OrderFormData) => orderApi.createOrder({
      ...data,
      assignedEquipmentId: equipmentId,
      quantityProduced: 0,
      status: 'Pending' as any,
    }),
    onSuccess: () => {
      toast({
        title: 'Order created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['scheduledOrders'] });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create order',
        description: error.message || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const resetForm = () => {
    setFormData({
      orderNumber: '',
      productName: '',
      quantityRequested: 0,
      priority: OrderPriority.Normal,
      scheduledStartTime: '',
      estimatedEndTime: '',
    });
    setShowWarning(true);
  };

  const handleSubmit = () => {
    if (!formData.orderNumber || !formData.productName || !formData.quantityRequested) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.scheduledStartTime && formData.estimatedEndTime) {
      const startTime = new Date(formData.scheduledStartTime);
      const endTime = new Date(formData.estimatedEndTime);
      
      if (endTime <= startTime) {
        toast({
          title: 'Invalid Date Range',
          description: 'Estimated end time must be after the scheduled start time',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        return;
      }
    }

    if (equipmentState === EquipmentState.Red) {
      const confirmed = window.confirm(
        `WARNING: ${equipmentName} is currently in RED state (Standing Still).\n\n` +
        `The order will be created, but the equipment needs to be started before production can begin.\n\n` +
        `Do you want to proceed with creating this order?`
      );
      
      if (!confirmed) {
        return;
      }
    }

    createOrderMutation.mutate(formData);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getStateWarning = () => {
    if (equipmentState === EquipmentState.Red) {
      return {
        status: 'warning' as const,
        title: 'Equipment is currently stopped',
        description: `${equipmentName} is in RED state (Standing Still). The order will be created and scheduled, but the equipment needs to be started before production can begin.`,
      };
    }
    if (equipmentState === EquipmentState.Yellow) {
      return {
        status: 'info' as const,
        title: 'Equipment is starting up',
        description: `${equipmentName} is in YELLOW state (Starting Up/Winding Down). The order will be scheduled and ready when the equipment is fully operational.`,
      };
    }
    return null;
  };

  const stateWarning = getStateWarning();

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Order for {equipmentName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {stateWarning && showWarning && (
              <Alert status={stateWarning.status}>
                <AlertIcon />
                <VStack align="start" spacing={1} flex={1}>
                  <AlertTitle fontSize="sm">{stateWarning.title}</AlertTitle>
                  <AlertDescription fontSize="xs">
                    {stateWarning.description}
                  </AlertDescription>
                </VStack>
              </Alert>
            )}

            <FormControl isRequired>
              <FormLabel fontSize="sm">Order Number</FormLabel>
              <Input
                placeholder="ORD-2026-XXX"
                value={formData.orderNumber}
                onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Product Name</FormLabel>
              <Input
                placeholder="e.g., Classic Brick 2x4 Red"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Quantity Requested</FormLabel>
              <Input
                type="number"
                min={1}
                placeholder="5000"
                value={formData.quantityRequested || ''}
                onChange={(e) => setFormData({ ...formData, quantityRequested: parseInt(e.target.value) || 0 })}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Priority</FormLabel>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as OrderPriority })}
              >
                <option value={OrderPriority.Low}>Low</option>
                <option value={OrderPriority.Normal}>Normal</option>
                <option value={OrderPriority.High}>High</option>
                <option value={OrderPriority.Critical}>Critical</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Scheduled Start Time</FormLabel>
              <Input
                type="datetime-local"
                value={formData.scheduledStartTime}
                onChange={(e) => setFormData({ ...formData, scheduledStartTime: e.target.value })}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Estimated End Time</FormLabel>
              <Input
                type="datetime-local"
                min={formData.scheduledStartTime || undefined}
                value={formData.estimatedEndTime}
                onChange={(e) => setFormData({ ...formData, estimatedEndTime: e.target.value })}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={createOrderMutation.isPending}
          >
            Create Order
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateOrderModal;

