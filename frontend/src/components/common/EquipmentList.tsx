import React from 'react';
import { Box, Grid, Heading, Text, HStack, VStack } from '@chakra-ui/react';
import { Equipment, EquipmentState } from '../../types/equipment';

interface EquipmentListProps {
  equipment: Equipment[];
  onSelectEquipment: (id: number) => void;
  selectedId?: number;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ equipment, onSelectEquipment, selectedId }) => {
  const getStateColor = (state: EquipmentState) => {
    switch (state) {
      case EquipmentState.Red:
        return 'red.500';
      case EquipmentState.Yellow:
        return 'yellow.400';
      case EquipmentState.Green:
        return 'green.500';
      default:
        return 'gray.500';
    }
  };

  return (
    <Box bg="white" p={5} borderRadius="xl" boxShadow="md">
      <Heading size="md" mb={5}>Equipment List</Heading>
      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
        {equipment.map((item) => (
          <Box
            key={item.id}
            bg={selectedId === item.id ? 'blue.50' : 'gray.50'}
            border="2px"
            borderColor={selectedId === item.id ? 'primary.500' : 'gray.200'}
            borderRadius="lg"
            p={4}
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ borderColor: 'primary.500', boxShadow: 'md' }}
            onClick={() => onSelectEquipment(item.id)}
          >
            <HStack justify="space-between" mb={3}>
              <Heading size="sm">{item.name}</Heading>
              <Box
                w={5}
                h={5}
                borderRadius="full"
                bg={getStateColor(item.currentState)}
                border="2px"
                borderColor="white"
                boxShadow="md"
              />
            </HStack>
            <HStack justify="space-between" fontSize="sm">
              <Text color="gray.600">ID: {item.id}</Text>
              <Text fontWeight="semibold" color={getStateColor(item.currentState)}>
                {item.currentState}
              </Text>
            </HStack>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default EquipmentList;

