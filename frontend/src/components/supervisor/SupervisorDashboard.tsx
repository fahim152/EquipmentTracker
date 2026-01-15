import React, { useState } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Progress,
  SimpleGrid,
  Spinner,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEquipment, useEquipmentDetail } from '../../queries/equipmentQueries';
import { useOrders, useScheduledOrders } from '../../queries/orderQueries';
import { orderApi } from '../../api/orderApi';
import { Order, OrderStatus, OrderPriority, EquipmentState } from '../../types/equipment';
import CreateOrderModal from './modals/CreateOrderModal';
import EditOrderModal from './modals/EditOrderModal';

const SupervisorDashboard: React.FC = () => {
  const { data: equipment } = useEquipment();
  const { data: orders } = useOrders();
  const { data: scheduledOrders } = useScheduledOrders();
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null);

  const { data: selectedEquipmentDetail, isLoading: isLoadingDetail } = useEquipmentDetail(
    selectedEquipmentId || 0
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);

  const toast = useToast();
  const queryClient = useQueryClient();

  const deleteOrderMutation = useMutation({
    mutationFn: (orderId: number) => orderApi.deleteOrder(orderId),
    onSuccess: () => {
      toast({
        title: 'Order deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['scheduledOrders'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete order',
        description: error.message || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const getStateColor = (state: EquipmentState) => {
    switch (state) {
      case EquipmentState.Red:
        return 'red.500';
      case EquipmentState.Yellow:
        return 'yellow.400';
      case EquipmentState.Green:
        return 'green.500';
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return 'gray';
      case OrderStatus.Scheduled:
        return 'blue';
      case OrderStatus.InProgress:
        return 'green';
      case OrderStatus.Completed:
        return 'purple';
      case OrderStatus.Cancelled:
        return 'red';
    }
  };

  const getPriorityColor = (priority: OrderPriority) => {
    switch (priority) {
      case OrderPriority.Low:
        return 'gray';
      case OrderPriority.Normal:
        return 'blue';
      case OrderPriority.High:
        return 'orange';
      case OrderPriority.Critical:
        return 'red';
    }
  };

  const getProgress = (order: Order) => {
    return Math.min(100, Math.round((order.quantityProduced / order.quantityRequested) * 100));
  };

  const activeOrders = orders?.filter(o => o.status === OrderStatus.InProgress) || [];
  const scheduledOrdersList = orders?.filter(o => o.status === OrderStatus.Scheduled) || [];
  const completedOrders = orders?.filter(o => o.status === OrderStatus.Completed) || [];

  const selectedEquipment = selectedEquipmentDetail || equipment?.find(e => e.id === selectedEquipmentId);
  const equipmentOrders = orders?.filter(o => o.assignedEquipmentId === selectedEquipmentId) || [];
  const equipmentScheduled = scheduledOrders?.filter(so => so.equipmentId === selectedEquipmentId) || [];

  const getStateStats = () => {
    if (!equipment) return { red: 0, yellow: 0, green: 0 };
    return {
      red: equipment.filter(e => e.currentState === EquipmentState.Red).length,
      yellow: equipment.filter(e => e.currentState === EquipmentState.Yellow).length,
      green: equipment.filter(e => e.currentState === EquipmentState.Green).length,
    };
  };

  const stats = getStateStats();

  if (!equipment || !orders) {
    return (
      <Box minH="400px" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="primary.500" thickness="4px" />
          <Text color="gray.600">Loading supervisor dashboard...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="calc(100vh - 200px)" bg="gray.50">
      <Box bg="white" p={6} borderBottom="2px" borderColor="gray.200">
        <Heading size="lg" mb={5}>Supervisor Control Center</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          <Box bg="gray.50" p={4} borderRadius="lg" border="2px" borderColor="gray.200">
            <Text fontSize="xs" color="gray.600" textTransform="uppercase" letterSpacing="wide" mb={2}>
              Active Orders
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="primary.500">
              {activeOrders.length}
            </Text>
          </Box>
          <Box bg="gray.50" p={4} borderRadius="lg" border="2px" borderColor="gray.200">
            <Text fontSize="xs" color="gray.600" textTransform="uppercase" letterSpacing="wide" mb={2}>
              Scheduled
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="primary.500">
              {scheduledOrdersList.length}
            </Text>
          </Box>
          <Box bg="gray.50" p={4} borderRadius="lg" border="2px" borderColor="gray.200">
            <Text fontSize="xs" color="gray.600" textTransform="uppercase" letterSpacing="wide" mb={2}>
              Completed Today
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="primary.500">
              {completedOrders.length}
            </Text>
          </Box>
          <Box bg="gray.50" p={4} borderRadius="lg" border="2px" borderColor="gray.200">
            <Text fontSize="xs" color="gray.600" textTransform="uppercase" letterSpacing="wide" mb={2}>
              Equipment Status
            </Text>
            <HStack spacing={4} mt={2}>
              <Text fontWeight="semibold" color="green.500">
                {stats.green} Green
              </Text>
              <Text fontWeight="semibold" color="yellow.400">
                {stats.yellow} Yellow
              </Text>
              <Text fontWeight="semibold" color="red.500">
                {stats.red} Red
              </Text>
            </HStack>
          </Box>
        </SimpleGrid>
      </Box>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={5} p={5}>
        <Box bg="white" borderRadius="xl" p={5} boxShadow="md">
          <Heading size="md" mb={4}>Equipment Overview</Heading>
          <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={3} maxH="70vh" overflowY="auto">
            {equipment.map((item) => (
              <Box
                key={item.id}
                bg={selectedEquipmentId === item.id ? 'blue.50' : 'gray.50'}
                border="2px"
                borderColor={selectedEquipmentId === item.id ? 'primary.500' : 'gray.200'}
                borderRadius="lg"
                p={3}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ borderColor: 'primary.500', boxShadow: 'md' }}
                onClick={() => setSelectedEquipmentId(item.id)}
              >
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="semibold" fontSize="sm">{item.name}</Text>
                  <Badge colorScheme={
                    item.currentState === EquipmentState.Green ? 'green' :
                    item.currentState === EquipmentState.Yellow ? 'yellow' : 'red'
                  }>
                    {item.currentState}
                  </Badge>
                </HStack>
                {item.currentOrder && (
                  <VStack align="stretch" spacing={2} mt={2} pt={2} borderTop="1px" borderColor="gray.200">
                    <Text fontSize="xs" color="primary.500" fontWeight="semibold">
                      {item.currentOrder.orderNumber}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {item.currentOrder.productName}
                    </Text>
                    <Progress
                      value={getProgress(item.currentOrder)}
                      size="sm"
                      colorScheme="blue"
                      borderRadius="full"
                    />
                    <Text fontSize="xs" color="gray.600">
                      {item.currentOrder.quantityProduced} / {item.currentOrder.quantityRequested}
                    </Text>
                  </VStack>
                )}
                {!item.currentOrder && (
                  <Text fontSize="xs" color="gray.400" fontStyle="italic" mt={2}>
                    Idle
                  </Text>
                )}
              </Box>
            ))}
          </Grid>
        </Box>

        <Box bg="white" borderRadius="xl" p={5} boxShadow="md">
          {isLoadingDetail ? (
            <Box minH="400px" display="flex" alignItems="center" justifyContent="center">
              <VStack spacing={4}>
                <Spinner size="lg" color="primary.500" thickness="3px" />
                <Text color="gray.600" fontSize="sm">Loading equipment details...</Text>
              </VStack>
            </Box>
          ) : selectedEquipment ? (
            <VStack align="stretch" spacing={5} maxH="75vh" overflowY="auto">
              <HStack justify="space-between" pb={4} borderBottom="2px" borderColor="gray.200">
                <VStack align="start" spacing={1}>
                  <Heading size="md">{selectedEquipment.name}</Heading>
                </VStack>
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    + Create Order
                  </Button>
                  <Badge
                    colorScheme={
                      selectedEquipment.currentState === EquipmentState.Green ? 'green' :
                      selectedEquipment.currentState === EquipmentState.Yellow ? 'yellow' : 'red'
                    }
                    px={4}
                    py={2}
                    borderRadius="full"
                    fontSize="sm"
                  >
                    {selectedEquipment.currentState}
                  </Badge>
                </HStack>
              </HStack>

              {selectedEquipment.currentOrder && (
                <Box>
                  <Heading size="sm" mb={3}>Current Order</Heading>
                  <Box bg="gray.50" border="2px" borderColor="gray.200" borderRadius="lg" p={4}>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="lg" fontWeight="bold" color="primary.500">
                        {selectedEquipment.currentOrder.orderNumber}
                      </Text>
                      <Badge colorScheme={getPriorityColor(selectedEquipment.currentOrder.priority)}>
                        {selectedEquipment.currentOrder.priority}
                      </Badge>
                    </HStack>
                    <Text fontSize="md" mb={4}>{selectedEquipment.currentOrder.productName}</Text>
                    <SimpleGrid columns={3} spacing={3} mb={3}>
                      <Box>
                        <Text fontSize="xs" color="gray.600" mb={1}>Progress</Text>
                        <Text fontSize="xl" fontWeight="bold">{getProgress(selectedEquipment.currentOrder)}%</Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.600" mb={1}>Produced</Text>
                        <Text fontSize="xl" fontWeight="bold">{selectedEquipment.currentOrder.quantityProduced}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.600" mb={1}>Target</Text>
                        <Text fontSize="xl" fontWeight="bold">{selectedEquipment.currentOrder.quantityRequested}</Text>
                      </Box>
                    </SimpleGrid>
                    {selectedEquipment.currentOrder.actualStartTime && (
                      <Box pt={3} borderTop="1px" borderColor="gray.200">
                        <HStack justify="space-between" fontSize="sm">
                          <Text color="gray.600">Started:</Text>
                          <Text fontWeight="medium">
                            {new Date(selectedEquipment.currentOrder.actualStartTime).toLocaleString()}
                          </Text>
                        </HStack>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}

              {equipmentOrders.length > 0 && (
                <Box>
                  <Heading size="sm" mb={3}>All Orders ({equipmentOrders.length})</Heading>
                  <VStack spacing={2}>
                    {equipmentOrders.map((order) => (
                      <Box key={order.id} bg="gray.50" border="1px" borderColor="gray.200" borderRadius="lg" p={3} w="full">
                        <HStack justify="space-between" mb={1}>
                          <HStack spacing={2}>
                            <Badge colorScheme={getStatusColor(order.status)} fontSize="xs">
                              {order.status}
                            </Badge>
                            <Text fontSize="sm" fontWeight="semibold" color="primary.500">
                              {order.orderNumber}
                            </Text>
                          </HStack>
                          <HStack spacing={1}>
                            <Button
                              size="xs"
                              variant="ghost"
                              colorScheme="blue"
                              onClick={() => {
                                setOrderToEdit(order);
                                setIsEditModalOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="xs"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => {
                                if (window.confirm(`Delete order ${order.orderNumber}?`)) {
                                  deleteOrderMutation.mutate(order.id);
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </HStack>
                        </HStack>
                        <Text fontSize="sm" mb={2}>{order.productName}</Text>
                        <HStack justify="space-between" fontSize="xs" color="gray.600">
                          <Text>Quantity: {order.quantityRequested}</Text>
                          <Badge colorScheme={getPriorityColor(order.priority)} fontSize="xs">
                            {order.priority}
                          </Badge>
                        </HStack>
                        {order.scheduledStartTime && (
                          <Text fontSize="xs" color="gray.600" mt={1}>
                            Scheduled: {new Date(order.scheduledStartTime).toLocaleString()}
                          </Text>
                        )}
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}

              {equipmentScheduled.length > 0 && (
                <Box>
                  <Heading size="sm" mb={3}>Scheduled Orders ({equipmentScheduled.length})</Heading>
                  <VStack spacing={2}>
                    {equipmentScheduled.map((scheduled) => (
                      <Box key={scheduled.id} bg="gray.50" border="1px" borderColor="gray.200" borderRadius="lg" p={3} w="full">
                        <HStack justify="space-between" mb={1}>
                          <HStack spacing={2}>
                            <Badge colorScheme="blue" fontSize="xs">#{scheduled.sequenceNumber}</Badge>
                            <Text fontSize="sm" fontWeight="semibold" color="primary.500">
                              {scheduled.order?.orderNumber}
                            </Text>
                          </HStack>
                          <HStack spacing={1}>
                            <Button
                              size="xs"
                              variant="ghost"
                              colorScheme="blue"
                              onClick={() => {
                                setOrderToEdit(scheduled.order || null);
                                setIsEditModalOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="xs"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => {
                                if (window.confirm(`Delete order ${scheduled.order?.orderNumber}?`)) {
                                  if (scheduled.order?.id) {
                                    deleteOrderMutation.mutate(scheduled.order.id);
                                  }
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </HStack>
                        </HStack>
                        <Text fontSize="sm" mb={2}>{scheduled.order?.productName}</Text>
                        <HStack justify="space-between" fontSize="xs" color="gray.600">
                          <Text>Start: {new Date(scheduled.scheduledStartTime).toLocaleTimeString()}</Text>
                          <Text>End: {new Date(scheduled.estimatedEndTime).toLocaleTimeString()}</Text>
                        </HStack>
                        {scheduled.order && (
                          <Badge mt={2} colorScheme={getPriorityColor(scheduled.order.priority)} fontSize="xs">
                            {scheduled.order.priority}
                          </Badge>
                        )}
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}

              <Box>
                <Heading size="sm" mb={3}>Order History</Heading>
                {equipmentOrders.length > 0 ? (
                  <VStack spacing={2} maxH="300px" overflowY="auto">
                    {equipmentOrders.map((order) => (
                      <Box key={order.id} bg="gray.50" border="1px" borderColor="gray.200" borderRadius="lg" p={3} w="full">
                        <HStack justify="space-between" mb={1}>
                          <Text fontSize="sm" fontWeight="semibold" color="primary.500">
                            {order.orderNumber}
                          </Text>
                          <Badge colorScheme={getStatusColor(order.status)} fontSize="xs">
                            {order.status}
                          </Badge>
                        </HStack>
                        <Text fontSize="sm" color="gray.600" mb={1}>{order.productName}</Text>
                        <Text fontSize="xs" color="gray.600">
                          {order.quantityProduced} / {order.quantityRequested}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Text fontSize="sm" color="gray.500" fontStyle="italic">No order history</Text>
                )}
              </Box>
            </VStack>
          ) : (
            <VStack h="400px" justify="center" align="center">
              <Heading size="md" color="gray.600">Select equipment to view details</Heading>
              <Text color="gray.500">Click on any equipment card to see current orders, schedule, and history</Text>
            </VStack>
          )}
        </Box>
      </Grid>

      {selectedEquipment && (
        <>
          <CreateOrderModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            equipmentId={selectedEquipment.id}
            equipmentName={selectedEquipment.name}
            equipmentState={selectedEquipment.currentState}
          />
          <EditOrderModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setOrderToEdit(null);
            }}
            order={orderToEdit}
          />
        </>
      )}
    </Box>
  );
};

export default SupervisorDashboard;

