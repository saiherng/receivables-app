'use client';
import React, { useEffect, useState } from 'react';
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
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Only redirect if we're not loading and there's no user
    if (!loading && !user && !isRedirecting) {
      setIsRedirecting(true);
      router.push('/auth/login');
    }
  }, [user, loading, router, isRedirecting]);

  // Show loading spinner while checking authentication
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

  // Show loading spinner while redirecting
  if (isRedirecting) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Center>
          <VStack spacing={4}>
            <Spinner size="xl" color="orange.500" thickness="4px" />
            <Text color="gray.600" fontSize="lg">
              Redirecting to login...
            </Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  // If no user and not loading, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
}
