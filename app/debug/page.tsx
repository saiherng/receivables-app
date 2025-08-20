'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { apiService } from '@/lib/api';
import { Box, Button, Text, VStack, Code, Alert, AlertIcon } from '@chakra-ui/react';

export default function DebugPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('Session check:', { session, error });
      setSession(session);
      setLoading(false);
    } catch (err) {
      console.error('Session check error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  const testApiCall = async () => {
    try {
      setTestResult('Testing API call...');
      const result = await apiService.getReceivables();
      setTestResult(JSON.stringify(result, null, 2));
      setError('');
    } catch (err) {
      console.error('API test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setTestResult('');
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setTestResult('');
    setError('');
  };

  if (loading) {
    return (
      <Box p={8}>
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box p={8} maxW="800px" mx="auto">
      <VStack spacing={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">Authentication Debug</Text>
        
        <Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
          <Text fontWeight="bold" mb={2}>Session Status:</Text>
          {session ? (
            <VStack align="start" spacing={2}>
              <Text>✅ Authenticated</Text>
              <Text>Email: {session.user.email}</Text>
              <Text>User ID: {session.user.id}</Text>
              <Text>Token expires: {new Date(session.expires_at * 1000).toLocaleString()}</Text>
            </VStack>
          ) : (
            <Text>❌ Not authenticated</Text>
          )}
        </Box>

        <Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
          <Text fontWeight="bold" mb={2}>Session Data:</Text>
          <Code p={4} borderRadius="md" overflow="auto" maxH="200px">
            {JSON.stringify(session, null, 2)}
          </Code>
        </Box>

        <VStack spacing={4}>
          <Button colorScheme="blue" onClick={testApiCall} isDisabled={!session}>
            Test API Call
          </Button>
          
          <Button colorScheme="red" onClick={signOut}>
            Sign Out
          </Button>
        </VStack>

        {error && (
          <Alert status="error">
            <AlertIcon />
            <Text>Error: {error}</Text>
          </Alert>
        )}

        {testResult && (
          <Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
            <Text fontWeight="bold" mb={2}>API Test Result:</Text>
            <Code p={4} borderRadius="md" overflow="auto" maxH="300px">
              {testResult}
            </Code>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
