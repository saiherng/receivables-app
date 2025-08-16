'use client';
import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Text,
  Button,
  Input,
  Select,
  Textarea,
  Flex,
  Box,
  Grid,
  GridItem,
  Icon,
  VStack,
  HStack,
  Container,
} from '@chakra-ui/react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { ThemeSwitcherButtons } from '@/components/theme/ThemeSwitcher';
import { Palette, Sun, Moon, Droplets, Leaf } from 'lucide-react';

export default function ThemeDemo() {
  const { theme } = useTheme();

  const themeInfo = {
    light: {
      name: 'Light',
      icon: Sun,
      description: 'Clean and bright theme for daytime use',
      colors: ['#ffffff', '#f8fafc', '#e2e8f0', '#64748b']
    },
    dark: {
      name: 'Dark',
      icon: Moon,
      description: 'Easy on the eyes for nighttime use',
      colors: ['#0f172a', '#1e293b', '#334155', '#64748b']
    },
    blue: {
      name: 'Blue',
      icon: Droplets,
      description: 'Professional blue theme',
      colors: ['#ffffff', '#eff6ff', '#dbeafe', '#3b82f6']
    },
    green: {
      name: 'Green',
      icon: Leaf,
      description: 'Nature-inspired green theme',
      colors: ['#ffffff', '#f0fdf4', '#dcfce7', '#16a34a']
    }
  };

  const currentTheme = themeInfo[theme];

  return (
    <Box p={6}>
      <Container maxW="4xl">
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Text fontSize="3xl" fontWeight="bold" color="gray.900">Theme System</Text>
            <Text color="gray.600" mt={1}>
              Explore different themes and see how they affect the UI
            </Text>
          </Box>
          <Flex align="center" gap={4}>
            <Flex align="center" gap={2}>
              <Icon as={Palette} w="20px" h="20px" color="gray.500" />
              <Text fontSize="sm" color="gray.500">Current: {currentTheme.name}</Text>
            </Flex>
            <ThemeSwitcherButtons />
          </Flex>
        </Flex>

        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
          {/* Theme Information */}
          <GridItem>
            <Card>
              <CardHeader>
                <Flex align="center" gap={2}>
                  <Icon as={currentTheme.icon} w="20px" h="20px" />
                  <Text fontSize="lg" fontWeight="semibold">{currentTheme.name} Theme</Text>
                </Flex>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Text color="gray.600">{currentTheme.description}</Text>
                  
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>Theme Colors</Text>
                    <HStack gap={2}>
                      {currentTheme.colors.map((color, index) => (
                        <Box
                          key={index}
                          w="32px"
                          h="32px"
                          borderRadius="md"
                          border="1px solid"
                          borderColor="gray.200"
                          bg={color}
                          title={color}
                        />
                      ))}
                    </HStack>
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>CSS Variables</Text>
                    <Box fontSize="xs" fontFamily="mono" bg="gray.100" p={2} borderRadius="md">
                      <Text>--background: {getComputedStyle(document.documentElement).getPropertyValue('--background')}</Text>
                      <Text>--foreground: {getComputedStyle(document.documentElement).getPropertyValue('--foreground')}</Text>
                      <Text>--primary: {getComputedStyle(document.documentElement).getPropertyValue('--primary')}</Text>
                    </Box>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* Component Examples */}
          <GridItem>
            <Card>
              <CardHeader>
                <Text fontSize="lg" fontWeight="semibold">Component Examples</Text>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>Input Field</Text>
                    <Input placeholder="Type something..." />
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>Select Dropdown</Text>
                    <Select>
                      <option value="option1">Option 1</option>
                      <option value="option2">Option 2</option>
                      <option value="option3">Option 3</option>
                    </Select>
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>Textarea</Text>
                    <Textarea placeholder="Enter some text..." rows={3} />
                  </Box>

                  <HStack gap={2}>
                    <Button>Primary Button</Button>
                    <Button variant="outline">Outline Button</Button>
                    <Button variant="ghost">Secondary Button</Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Available Themes */}
        <Card mt={6}>
          <CardHeader>
            <Text fontSize="lg" fontWeight="semibold">Available Themes</Text>
          </CardHeader>
          <CardBody>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
              {Object.entries(themeInfo).map(([key, info]) => {
                const IconComponent = info.icon;
                const isActive = theme === key;
                
                return (
                  <Card 
                    key={key} 
                    cursor="pointer" 
                    transition="all 0.2s"
                    border={isActive ? "2px solid" : "1px solid"}
                    borderColor={isActive ? "orange.500" : "gray.200"}
                    _hover={{ boxShadow: "md" }}
                  >
                    <CardBody p={4}>
                      <Flex align="center" gap={3} mb={2}>
                        <Icon as={IconComponent} w="20px" h="20px" />
                        <Text fontWeight="medium">{info.name}</Text>
                      </Flex>
                      <Text fontSize="sm" color="gray.600">{info.description}</Text>
                      <HStack gap={1} mt={3}>
                        {info.colors.map((color, index) => (
                          <Box
                            key={index}
                            w="16px"
                            h="16px"
                            borderRadius="md"
                            border="1px solid"
                            borderColor="gray.200"
                            bg={color}
                          />
                        ))}
                      </HStack>
                    </CardBody>
                  </Card>
                );
              })}
            </Grid>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}
