'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Spinner, Center, Text, VStack } from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      fallback || (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
          <Center>
            <VStack spacing={4}>
              <Spinner size="xl" color="orange.500" thickness="4px" />
              <Text color="gray.600" fontSize="lg">
                Loading...
              </Text>
            </VStack>
          </Center>
        </Box>
      )
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}
