'use client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Toast: {
      defaultProps: {
        position: 'top',
      },
    },
  },
});

export function ChakraUIProvider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  );
}
