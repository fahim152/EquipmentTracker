import React, { useState } from 'react';
import { Box, Container, VStack, Text, Spinner } from '@chakra-ui/react';
import { useEquipment, useAllHistory, useEquipmentHistory } from '../../queries/equipmentQueries';
import EquipmentList from '../common/EquipmentList';
import HistoryTable from '../common/HistoryTable';

const Dashboard: React.FC = () => {
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | undefined>();
  const { data: equipment, isLoading: equipmentLoading } = useEquipment();
  const { data: allHistory } = useAllHistory();
  const { data: equipmentHistory } = useEquipmentHistory(selectedEquipmentId || 0);

  if (equipmentLoading) {
    return (
      <Box minH="400px" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="primary.500" thickness="4px" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={5}>
      <VStack spacing={8} align="stretch">
        {equipment && (
          <EquipmentList
            equipment={equipment}
            onSelectEquipment={setSelectedEquipmentId}
            selectedId={selectedEquipmentId}
          />
        )}

        <Box>
          {selectedEquipmentId && equipmentHistory ? (
            <HistoryTable
              history={equipmentHistory}
              title={`History for Equipment #${selectedEquipmentId}`}
            />
          ) : allHistory ? (
            <HistoryTable history={allHistory} title="All Equipment History" />
          ) : (
            <Box textAlign="center" py={10} color="gray.500" fontStyle="italic">
              Select an equipment to view its history
            </Box>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default Dashboard;

