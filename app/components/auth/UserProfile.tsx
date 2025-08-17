'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function UserProfile() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/auth/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return null;
  }



  const getUserDisplayName = (email: string) => {
    if (!email) return 'User';
    
    const username = email.split('@')[0];
    
    // Capitalize first letter and replace common separators with spaces
    const displayName = username
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    
    return displayName;
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        rightIcon={<ChevronDown size={16} />}
        leftIcon={
          <Avatar
            size="sm"
            name={user.email || 'User'}
            bg="orange.500"
            color="white"
            fontSize="sm"
          >
           
          </Avatar>
        }
        _hover={{ bg: 'gray.100' }}
        _active={{ bg: 'gray.200' }}
      >
        <VStack spacing={0} align="start">
          <Text fontSize="sm" fontWeight="medium" color="gray.700">
            {getUserDisplayName(user.email || '')}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {user.email}
          </Text>
        </VStack>
      </MenuButton>
      <MenuList>
        <MenuItem icon={<User size={16} />}>
          <VStack align="start" spacing={0}>
            <Text fontSize="sm" fontWeight="medium">
              {getUserDisplayName(user.email || '')}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {user.email}
            </Text>
          </VStack>
        </MenuItem>
        

        <MenuDivider />
        <MenuItem
          icon={<LogOut size={16} />}
          onClick={handleSignOut}
          isDisabled={isLoggingOut}
          color="red.600"
        >
          {isLoggingOut ? 'Signing out...' : 'Sign out'}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
