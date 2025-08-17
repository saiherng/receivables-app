'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Divider,
  HStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const router = useRouter();
  const toast = useToast();

  // Check if user is already authenticated
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Use hard redirect to bypass middleware timing issues
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Login page: Error checking user authentication:', error);
      }
    };
    
    checkUser();
  }, [router]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          setError(error.message);
        } else {
          setMessage('Check your email for the confirmation link!');
          toast({
            title: 'Account created',
            description: 'Please check your email to confirm your account.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else {
          toast({
            title: 'Welcome back!',
            description: 'Successfully logged in.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          // Use simple hard redirect
          window.location.href = '/';
        }
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Password reset link sent to your email!');
        toast({
          title: 'Reset link sent',
          description: 'Check your email for password reset instructions.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

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
            <Heading size="lg">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Heading>
            <Text fontSize="sm" opacity={0.9}>
              {isSignUp 
                ? 'Sign up to start managing your receivables'
                : 'Sign in to your account'
              }
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

              {message && (
                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Mail size={16} />
                  </InputLeftElement>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Lock size={16} />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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

              <Button
                type="submit"
                w="full"
                bgGradient="linear(to-r, orange.500, orange.600)"
                _hover={{ bgGradient: "linear(to-r, orange.600, orange.700)" }}
                color="white"
                isLoading={isLoading}
                loadingText={isSignUp ? 'Creating account...' : 'Signing in...'}
                rightIcon={<ArrowRight size={16} />}
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Button>

              {!isSignUp && (
                <Button
                  variant="link"
                  color="orange.600"
                  size="sm"
                  onClick={handleForgotPassword}
                  isDisabled={isLoading || !email}
                >
                  Forgot password?
                </Button>
              )}

              <Divider />



              <HStack spacing={1} fontSize="sm">
                <Text color="gray.600">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </Text>
                <Button
                  variant="link"
                  color="orange.600"
                  size="sm"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                    setMessage(null);
                  }}
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </Button>
              </HStack>
            </VStack>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
}
