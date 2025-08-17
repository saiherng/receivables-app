'use client';
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Receipt, 
  CreditCard, 
  FileText, 
  Users,
  Banknote,
} from "lucide-react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Icon,
} from '@chakra-ui/react';
import { ChakraUIProvider } from '@/providers/ChakraProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import UserProfile from '@/components/auth/UserProfile';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Receivables",
    url: "/receivables",
    icon: Receipt,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
];

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current path is an auth page (login, reset-password, callback)
  const isAuthPage = pathname?.startsWith('/auth/');

  // If it's an auth page, render without sidebar and ProtectedRoute
  if (isAuthPage) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Receivables App</title>
          <meta name="description" content="Myanmar Business Receivables Tracker" />
        </head>
        <body>
          {children}
        </body>
      </html>
    );
  }

  // For all other pages, render with sidebar and ProtectedRoute
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Receivables App</title>
        <meta name="description" content="Myanmar Business Receivables Tracker" />
      </head>
      <body>
        <Box minH="100vh" bg="gray.50">
          <Flex>
            {/* Sidebar */}
            <Box
              w="280px"
              bg="white"
              borderRight="1px"
              borderColor="gray.200"
              h="100vh"
              position="sticky"
              top="0"
            >
              {/* Sidebar Header */}
              <Box p={6} borderBottom="1px" borderColor="gray.200">
                <HStack spacing={3}>
                  <Box
                    w="40px"
                    h="40px"
                    bgGradient="linear(to-br, orange.500, orange.600)"
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow="lg"
                  >
                    <Icon as={Banknote} w="24px" h="24px" color="white" />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" fontSize="lg" color="gray.900">
                      Receivables App
                    </Text>
                    <Text fontSize="xs" color="orange.600" fontWeight="medium">
                      Business Tracker
                    </Text>
                  </VStack>
                </HStack>
              </Box>

              {/* Navigation */}
              <VStack spacing={2} p={3} align="stretch">
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="orange.700"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  px={3}
                  py={2}
                >
                  Navigation
                </Text>
                {navigationItems.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <Link key={item.title} href={item.url}>
                      <Box
                        as="div"
                        display="flex"
                        alignItems="center"
                        gap={3}
                        px={4}
                        py={3}
                        borderRadius="xl"
                        mb={1}
                        transition="all 0.2s"
                        cursor="pointer"
                        bg={isActive ? 'orange.500' : 'transparent'}
                        color={isActive ? 'white' : 'gray.700'}
                        _hover={{
                          bg: isActive ? 'orange.500' : 'gray.100',
                          color: isActive ? 'white' : 'orange.800',
                        }}
                        boxShadow={isActive ? 'md' : 'none'}
                      >
                        <Icon as={item.icon} w="20px" h="20px" />
                        <Text fontWeight="medium">{item.title}</Text>
                      </Box>
                    </Link>
                  );
                })}
              </VStack>
            </Box>

            {/* Main Content */}
            <Box flex="1" display="flex" flexDirection="column">
              {/* Header */}
              <Box
                bg="white"
                borderBottom="1px"
                borderColor="gray.200"
                px={6}
                py={4}
              >
                <Flex justify="space-between" align="center">
                  <Text fontSize="xl" fontWeight="bold" color="gray.900">
                    Receivables Tracker
                  </Text>
                  <UserProfile />
                </Flex>
              </Box>

              {/* Page Content */}
              <Box flex="1" overflow="auto">
                <ProtectedRoute>
                  {children}
                </ProtectedRoute>
              </Box>
            </Box>
          </Flex>
        </Box>
      </body>
    </html>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChakraUIProvider>
      <AuthProvider>
        <LayoutContent>{children}</LayoutContent>
      </AuthProvider>
    </ChakraUIProvider>
  );
}