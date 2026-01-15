import React, { useState, useEffect } from 'react';
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
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '../../../api/orderApi';
import { Order, OrderPriority } from '../../../types/equipment';

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    orderNumber: '',
    productName: '',
    quantityRequested: 0,
    priority: OrderPriority.Normal,
    scheduledStartTime: '',
    estimatedEndTime: '',
  });

  useEffect(() => {
    if (order) {
      setFormData({
        orderNumber: order.orderNumber,
        productName: order.productName,
        quantityRequested: order.quantityRequested,
        priority: order.priority,
        scheduledStartTime: order.scheduledStartTime ? new Date(order.scheduledStartTime).toISOString().slice(0, 16) : '',
        estimatedEndTime: '', 
      });
    }
  }, [order]);

  const updateOrderMutation = useMutation({
    mutationFn: () => orderApi.updateOrder(order!.id, formData),
    onSuccess: () => {
      toast({
        title: 'Order updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['scheduledOrders'] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update order',
        description: error.message || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

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

    updateOrderMutation.mutate();
  };

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Order {order.orderNumber}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel fontSize="sm">Order Number</FormLabel>
              <Input
                value={formData.orderNumber}
                onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Product Name</FormLabel>
              <Input
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Quantity Requested</FormLabel>
              <Input
                type="number"
                min={1}
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
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={updateOrderMutation.isPending}
          >
            Update Order
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditOrderModal;

