'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Heading,
  useToast,
  Card,
  CardBody,
  CardHeader,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { Eye, EyeOff, Lock, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  // Check if user is already authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/receivables');
      }
    };
    
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate passwords
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        toast({
          title: 'Password updated',
          description: 'Your password has been successfully updated.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Box
        minH="100vh"
        bgGradient="linear(to-br, orange.50, orange.100)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        <Card
          maxW="md"
          w="full"
          bg="white"
          boxShadow="xl"
          borderRadius="xl"
          overflow="hidden"
        >
          <CardHeader
            bgGradient="linear(to-r, green.500, green.600)"
            color="white"
            textAlign="center"
            py={8}
          >
            <VStack spacing={2}>
              <Heading size="lg">Password Updated!</Heading>
              <Text fontSize="sm" opacity={0.9}>
                Redirecting to login...
              </Text>
            </VStack>
          </CardHeader>

          <CardBody p={8} textAlign="center">
            <VStack spacing={4}>
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                <AlertDescription>
                  Your password has been successfully updated. You will be redirected to the login page.
                </AlertDescription>
              </Alert>
            </VStack>
          </CardBody>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, orange.50, orange.100)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Card
        maxW="md"
        w="full"
        bg="white"
        boxShadow="xl"
        borderRadius="xl"
        overflow="hidden"
      >
        <CardHeader
          bgGradient="linear(to-r, orange.500, orange.600)"
          color="white"
          textAlign="center"
          py={8}
        >
          <VStack spacing={2}>
            <Heading size="lg">Reset Password</Heading>
            <Text fontSize="sm" opacity={0.9}>
              Enter your new password
            </Text>
          </VStack>
        </CardHeader>

        <CardBody p={8}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              {error && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Box>
                </Alert>
              )}

              <FormControl isRequired>
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={Lock} size={16} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    pl={10}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Confirm New Password</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={Lock} size={16} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    pl={10}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      icon={showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                w="full"
                bgGradient="linear(to-r, orange.500, orange.600)"
                _hover={{ bgGradient: "linear(to-r, orange.600, orange.700)" }}
                color="white"
                isLoading={isLoading}
                loadingText="Updating password..."
                rightIcon={<ArrowRight size={16} />}
              >
                Update Password
              </Button>

              <Button
                variant="link"
                color="orange.600"
                size="sm"
                onClick={() => router.push('/auth/login')}
              >
                Back to login
              </Button>
            </VStack>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
