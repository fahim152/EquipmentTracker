import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  Badge,
  Progress,
  Container,
  Spinner,
} from '@chakra-ui/react';
import { Equipment, EquipmentState, OrderStatus } from '../../types/equipment';
import { useChangeEquipmentState, useEquipmentHistory, useEquipmentDetail } from '../../queries/equipmentQueries';
import { useScheduledOrdersByEquipment, useOrdersByEquipment } from '../../queries/orderQueries';

interface HMIDashboardProps {
  equipment: Equipment[];
}

const HMIDashboard: React.FC<HMIDashboardProps> = ({ equipment }) => {
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null);
  const [equipmentNumber, setEquipmentNumber] = useState<string>('');
  const changeStateMutation = useChangeEquipmentState();
  const { data: history } = useEquipmentHistory(selectedEquipmentId ?? 0);
  const { data: selectedEquipmentDetail, isLoading: isLoadingDetail } = useEquipmentDetail(selectedEquipmentId ?? 0);
  const { data: scheduledOrders } = useScheduledOrdersByEquipment(selectedEquipmentId ?? 0);
  const { data: equipmentOrders } = useOrdersByEquipment(selectedEquipmentId ?? 0);

  const selectedEquipment = selectedEquipmentDetail || equipment.find((e) => e.id === selectedEquipmentId);

  const activeOrders = equipmentOrders?.filter(
    order => order.status === OrderStatus.InProgress || 
            order.status === OrderStatus.Pending ||
            order.status === OrderStatus.Scheduled
  ) || [];

  const lastCompletedOrder = equipmentOrders
    ?.filter(order => order.status === OrderStatus.Completed)
    ?.sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime())[0];

  const displayOrders = lastCompletedOrder 
    ? [...activeOrders, lastCompletedOrder]
    : activeOrders;

  const handleStateChange = (newState: EquipmentState) => {
    if (selectedEquipmentId) {
      changeStateMutation.mutate({ id: selectedEquipmentId, newState });
    }
  };

  const handleEquipmentNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(equipmentNumber);
    if (!isNaN(id) && equipment.find((e) => e.id === id)) {
      setSelectedEquipmentId(id);
      setEquipmentNumber('');
    } else {
      alert('Equipment not found');
    }
  };

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

  return (
    <Container maxW="container.md" py={5}>
      <Box bg="white" borderRadius="xl" p={6} boxShadow="lg">
        {!selectedEquipment ? (
          <VStack spacing={8} align="stretch">
            <Box bg="primary.500" color="white" p={5} borderRadius="xl">
              <Heading size="md" mb={4}>Quick Access</Heading>
              <form onSubmit={handleEquipmentNumberSubmit}>
                <HStack spacing={2}>
                  <Input
                    value={equipmentNumber}
                    onChange={(e) => setEquipmentNumber(e.target.value)}
                    placeholder="Enter or scan equipment number..."
                    bg="whiteAlpha.900"
                    color="gray.800"
                    fontWeight="medium"
                    autoFocus
                    size="lg"
                  />
                  <Button type="submit" colorScheme="whiteAlpha" size="lg" px={8}>
                    Go
                  </Button>
                </HStack>
                <Text fontSize="sm" mt={2} opacity={0.9}>
                  Enter equipment ID (1-21) or scan barcode
                </Text>
              </form>
            </Box>

            <Box>
              <Heading size="md" mb={4}>Or Select Equipment</Heading>
              <VStack spacing={3} maxH="400px" overflowY="auto">
                {equipment.map((item) => (
                  <Button
                    key={item.id}
                    onClick={() => setSelectedEquipmentId(item.id)}
                    w="full"
                    h="auto"
                    p={4}
                    bg="gray.50"
                    border="2px"
                    borderColor="gray.200"
                    borderRadius="xl"
                    _hover={{ borderColor: 'primary.500', bg: 'white', boxShadow: 'md' }}
                    transition="all 0.2s"
                  >
                    <HStack w="full" justify="space-between">
                      <Badge colorScheme="blue" fontSize="sm" fontWeight="bold">
                        #{item.id}
                      </Badge>
                      <Text fontWeight="semibold" flex={1} textAlign="left" ml={3}>
                        {item.name}
                      </Text>
                      <Box
                        w={4}
                        h={4}
                        borderRadius="full"
                        bg={getStateColor(item.currentState)}
                        border="2px"
                        borderColor="white"
                        boxShadow="md"
                      />
                    </HStack>
                  </Button>
                ))}
              </VStack>
            </Box>
          </VStack>
        ) : (
          <VStack spacing={5} align="stretch">
            <Button
              onClick={() => setSelectedEquipmentId(null)}
              variant="ghost"
              alignSelf="flex-start"
            >
              ← Back
            </Button>

            {isLoadingDetail ? (
              <Box minH="300px" display="flex" alignItems="center" justifyContent="center">
                <VStack spacing={4}>
                  <Spinner size="xl" color="primary.500" thickness="4px" />
                  <Text color="gray.600">Loading equipment details...</Text>
                </VStack>
              </Box>
            ) : selectedEquipment ? (
              <>
              <VStack spacing={4}>
              <Box bg="primary.500" color="white" px={6} py={3} borderRadius="xl">
                <Text fontSize="xs" opacity={0.8} textTransform="uppercase" letterSpacing="wide">
                  Equipment ID
                </Text>
                <Text fontSize="2xl" fontWeight="bold">
                  #{selectedEquipment.id}
                </Text>
              </Box>
              <Heading size="lg">{selectedEquipment.name}</Heading>
              <HStack spacing={3}>
                <Text>Current Status:</Text>
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

              {selectedEquipment.currentOrder && (
                <Box w="full" bg="blue.50" border="2px" borderColor="primary.500" borderRadius="xl" p={4}>
                  <Text fontSize="xs" color="primary.500" textTransform="uppercase" letterSpacing="wide" mb={1}>
                    Current Order
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="primary.500" mb={1}>
                    {selectedEquipment.currentOrder.orderNumber}
                  </Text>
                  <Text fontSize="sm" color="gray.700" mb={3}>
                    {selectedEquipment.currentOrder.productName}
                  </Text>
                  <Box>
                    <HStack justify="space-between" fontSize="sm" fontWeight="semibold" mb={2}>
                      <Text>
                        {selectedEquipment.currentOrder.quantityProduced} / {selectedEquipment.currentOrder.quantityRequested}
                      </Text>
                      <Text>
                        {Math.round((selectedEquipment.currentOrder.quantityProduced / selectedEquipment.currentOrder.quantityRequested) * 100)}%
                      </Text>
                    </HStack>
                    <Progress
                      value={(selectedEquipment.currentOrder.quantityProduced / selectedEquipment.currentOrder.quantityRequested) * 100}
                      colorScheme="blue"
                      borderRadius="full"
                      size="sm"
                    />
                  </Box>
                </Box>
              )}

              {displayOrders && displayOrders.length > 0 && (
                <Box w="full" bg="gray.50" border="2px" borderColor="gray.200" borderRadius="xl" p={3}>
                  <Text fontSize="xs" color="gray.600" textTransform="uppercase" letterSpacing="wide" mb={2}>
                    Orders ({displayOrders.length})
                  </Text>
                  <VStack spacing={2}>
                    {displayOrders.map((order) => (
                      <HStack
                        key={order.id}
                        w="full"
                        bg="white"
                        p={2}
                        borderRadius="md"
                        spacing={2}
                        borderLeft="3px"
                        borderLeftColor={
                          order.status === OrderStatus.InProgress ? 'green.500' :
                          order.status === OrderStatus.Pending ? 'orange.500' :
                          order.status === OrderStatus.Scheduled ? 'blue.500' :
                          'purple.500'
                        }
                      >
                        <Badge 
                          colorScheme={
                            order.status === OrderStatus.InProgress ? 'green' :
                            order.status === OrderStatus.Pending ? 'orange' :
                            order.status === OrderStatus.Scheduled ? 'blue' :
                            'purple'
                          } 
                          fontSize="xs"
                        >
                          {order.status}
                        </Badge>
                        <Text fontSize="sm" flex={1} fontWeight="medium">
                          {order.productName}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {order.orderNumber}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              )}
            </VStack>

            <Box>
              <Heading size="sm" mb={3}>Change State:</Heading>
              <VStack spacing={3}>
                <Button
                  w="full"
                  h="auto"
                  p={4}
                  onClick={() => handleStateChange(EquipmentState.Red)}
                  isDisabled={changeStateMutation.isPending}
                  variant={selectedEquipment.currentState === EquipmentState.Red ? 'solid' : 'outline'}
                  colorScheme="red"
                  borderWidth="2px"
                >
                  <HStack w="full">
                    <Box w={6} h={6} borderRadius="full" bg="red.500" border="2px" borderColor="white" boxShadow="md" />
                    <Text fontWeight="semibold">Red - Standing Still</Text>
                  </HStack>
                </Button>
                <Button
                  w="full"
                  h="auto"
                  p={4}
                  onClick={() => handleStateChange(EquipmentState.Yellow)}
                  isDisabled={changeStateMutation.isPending}
                  variant={selectedEquipment.currentState === EquipmentState.Yellow ? 'solid' : 'outline'}
                  colorScheme="yellow"
                  borderWidth="2px"
                >
                  <HStack w="full">
                    <Box w={6} h={6} borderRadius="full" bg="yellow.400" border="2px" borderColor="white" boxShadow="md" />
                    <Text fontWeight="semibold">Yellow - Starting/Stopping</Text>
                  </HStack>
                </Button>
                <Button
                  w="full"
                  h="auto"
                  p={4}
                  onClick={() => handleStateChange(EquipmentState.Green)}
                  isDisabled={changeStateMutation.isPending}
                  variant={selectedEquipment.currentState === EquipmentState.Green ? 'solid' : 'outline'}
                  colorScheme="green"
                  borderWidth="2px"
                >
                  <HStack w="full">
                    <Box w={6} h={6} borderRadius="full" bg="green.500" border="2px" borderColor="white" boxShadow="md" />
                    <Text fontWeight="semibold">Green - Producing</Text>
                  </HStack>
                </Button>
              </VStack>
            </Box>

            {history && history.length > 0 && (
              <Box>
                <Heading size="sm" mb={3}>Recent Changes:</Heading>
                <VStack spacing={2}>
                  {history.slice(0, 3).map((change) => (
                    <HStack
                      key={change.id}
                      w="full"
                      bg="gray.50"
                      p={3}
                      borderRadius="lg"
                      border="1px"
                      borderColor="gray.200"
                    >
                      <Box
                        w={3}
                        h={3}
                        borderRadius="full"
                        bg={getStateColor(change.state)}
                      />
                      <Text fontWeight="semibold" flex={1}>
                        {change.state}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {new Date(change.timestamp).toLocaleTimeString()}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            )}
              </>
            ) : (
              <Box textAlign="center" py={10} color="gray.500">
                <Text>Equipment not found</Text>
              </Box>
            )}
          </VStack>
        )}
      </Box>
    </Container>
  );
};

export default HMIDashboard;


