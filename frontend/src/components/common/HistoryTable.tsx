import React from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
} from '@chakra-ui/react';
import { EquipmentStateChange, EquipmentState } from '../../types/equipment';

interface HistoryTableProps {
  history: EquipmentStateChange[];
  title?: string;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ history, title = 'State Change History' }) => {
  const getStateColor = (state: EquipmentState) => {
    switch (state) {
      case EquipmentState.Red:
        return 'red';
      case EquipmentState.Yellow:
        return 'yellow';
      case EquipmentState.Green:
        return 'green';
      default:
        return 'gray';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (history.length === 0) {
    return (
      <Box bg="white" p={5} borderRadius="xl" boxShadow="md">
        <Heading size="md" mb={4}>{title}</Heading>
        <Text color="gray.500" fontStyle="italic" textAlign="center" py={5}>
          No history available yet
        </Text>
      </Box>
    );
  }

  return (
    <Box bg="white" p={5} borderRadius="xl" boxShadow="md">
      <Heading size="md" mb={4}>{title}</Heading>
      <Box overflowX="auto" borderRadius="lg" border="1px" borderColor="gray.200">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Equipment ID</Th>
              <Th>State</Th>
              <Th>Timestamp</Th>
              <Th>Changed By</Th>
            </Tr>
          </Thead>
          <Tbody>
            {history.map((change) => (
              <Tr key={change.id} _hover={{ bg: 'gray.50' }}>
                <Td>{change.equipmentId}</Td>
                <Td>
                  <Badge colorScheme={getStateColor(change.state)} fontSize="xs" px={2} py={1}>
                    {change.state}
                  </Badge>
                </Td>
                <Td>{formatTimestamp(change.timestamp)}</Td>
                <Td color="gray.600" fontFamily="monospace" fontSize="xs">
                  {change.changedById.substring(0, 8)}...
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default HistoryTable;

