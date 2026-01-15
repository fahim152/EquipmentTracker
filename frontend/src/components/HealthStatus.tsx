import React, { useState, useEffect } from 'react';
import { Box, HStack, VStack, Text, Badge } from '@chakra-ui/react';
import { healthApi, HealthCheckResponse } from '../api/healthApi';

const HealthStatus: React.FC = () => {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await healthApi.getHealth();
        setHealth(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading || !health) {
    return null;
  }

  const getStatusColor = (isHealthy: boolean) => isHealthy ? 'green.300' : 'red.300';

  return (
    <Box
      bg="whiteAlpha.200"
      backdropFilter="blur(10px)"
      p={2}
      borderRadius="md"
      border="1px"
      borderColor="whiteAlpha.300"
      minW="180px"
    >
      <VStack align="stretch" spacing={1}>
        <HStack justify="space-between" mb={1}>
          <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color="whiteAlpha.900">
            System
          </Text>
          <Badge colorScheme={health.status === 'Healthy' ? 'green' : 'yellow'} fontSize="xs">
            {health.status}
          </Badge>
        </HStack>

        <HStack spacing={2}>
          <Box w={2} h={2} borderRadius="full" bg={getStatusColor(health.database.isHealthy)} />
          <Text fontSize="xs" color="whiteAlpha.900">DB</Text>
   
        </HStack>

        <HStack spacing={2}>
          <Box w={2} h={2} borderRadius="full" bg={getStatusColor(health.pulsar.isHealthy)} />
          <Text fontSize="xs" color="whiteAlpha.900">Pulsar</Text>
          {!health.pulsar.isHealthy && (
            <Badge colorScheme="red" fontSize="xs" ml="auto">
              Off
            </Badge>
          )}
        </HStack>

        <HStack spacing={2}>
          <Box w={2} h={2} borderRadius="full" bg={getStatusColor(health.signalR.isHealthy)} />
          <Text fontSize="xs" color="whiteAlpha.900">SignalR</Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default HealthStatus;

