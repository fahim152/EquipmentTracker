import React, { useState, useEffect } from 'react';
import { Box, HStack, Text } from '@chakra-ui/react';

interface ConnectionStatusProps {
  isConnected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (isConnected) {
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShow(true);
    }
  }, [isConnected]);

  if (!show && isConnected) return null;

  return (
    <Box
      position="fixed"
      top={4}
      right={4}
      bg={isConnected ? 'green.500' : 'red.500'}
      color="white"
      px={4}
      py={2}
      borderRadius="full"
      boxShadow="lg"
      zIndex={9999}
    >
      <HStack spacing={2}>
        <Box w={2} h={2} borderRadius="full" bg="white" />
        <Text fontSize="sm" fontWeight="medium">
          {isConnected ? 'Live Updates Active' : 'Reconnecting...'}
        </Text>
      </HStack>
    </Box>
  );
};

export default ConnectionStatus;

