import React, { useState, useEffect } from 'react';
import { ChakraProvider, extendTheme, Box, Heading, Text, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import HMIDashboard from './components/hmi/HMIDashboard';
import Dashboard from './components/monitor/Dashboard';
import SupervisorDashboard from './components/supervisor/SupervisorDashboard';
import HealthStatus from './components/HealthStatus';
import { useEquipment } from './queries/equipmentQueries';
import { useSignalR } from './hooks/useSignalR';

const theme = extendTheme({
  colors: {
    primary: {
      50: '#e6f2ff',
      100: '#b3d9ff',
      200: '#80c0ff',
      300: '#4da6ff',
      400: '#1a8dff',
      500: '#0055BF',
      600: '#004499',
      700: '#003373',
      800: '#00224d',
      900: '#001126',
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 0,
      refetchOnMount: true,
    },
  },
});


const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const { data: equipment } = useEquipment();

  useSignalR();

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="primary.500" color="white" py={8} px={5} boxShadow="md" position="relative">
        <Box position="absolute" top={4} left={4}>
          <HealthStatus />
        </Box>
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={2}>
            Equipment Tracker
          </Heading>
          <Text fontSize="md" opacity={0.9}>
            Real-time equipment monitoring system
          </Text>
        </Box>
      </Box>

      <Tabs 
        index={activeTab} 
        onChange={setActiveTab}
        variant="enclosed"
        colorScheme="primary"
        bg="white"
        borderBottom="2px"
        borderColor="gray.200"
        position="sticky"
        top={0}
        zIndex={100}
      >
        <TabList justifyContent="center" gap={2} p={5}>
          <Tab 
            px={8} 
            py={3} 
            fontSize="md" 
            fontWeight="semibold"
            _selected={{ bg: 'primary.500', color: 'white', borderColor: 'primary.500' }}
          >
            HMI Interface
          </Tab>
          <Tab 
            px={8} 
            py={3} 
            fontSize="md" 
            fontWeight="semibold"
            _selected={{ bg: 'primary.500', color: 'white', borderColor: 'primary.500' }}
          >
            Monitor
          </Tab>
          <Tab 
            px={8} 
            py={3} 
            fontSize="md" 
            fontWeight="semibold"
            _selected={{ bg: 'primary.500', color: 'white', borderColor: 'primary.500' }}
          >
            Supervisor
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            {equipment && <HMIDashboard equipment={equipment} />}
          </TabPanel>
          <TabPanel p={0}>
            <Dashboard />
          </TabPanel>
          <TabPanel p={0}>
            <SupervisorDashboard />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
