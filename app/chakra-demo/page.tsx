'use client';
import React from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Heading,
  Container,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';

export default function ChakraDemo() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" mb={2}>Chakra UI Demo</Heading>
          <Text color="gray.600">Testing Chakra UI components in the receivables app</Text>
        </Box>

        <Card>
          <CardHeader>
            <Heading size="md">Basic Components</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text mb={2}>Input Field</Text>
                <Input placeholder="Type something..." />
              </Box>

              <Box>
                <Text mb={2}>Select Dropdown</Text>
                <Select placeholder="Choose an option">
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </Select>
              </Box>

              <Box>
                <Text mb={2}>Textarea</Text>
                <Textarea placeholder="Enter some text..." rows={3} />
              </Box>

              <HStack spacing={4}>
                <Button colorScheme="blue">Primary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Color Schemes</Heading>
          </CardHeader>
          <CardBody>
            <HStack spacing={4} wrap="wrap">
              <Button colorScheme="blue">Blue</Button>
              <Button colorScheme="green">Green</Button>
              <Button colorScheme="red">Red</Button>
              <Button colorScheme="purple">Purple</Button>
              <Button colorScheme="orange">Orange</Button>
              <Button colorScheme="teal">Teal</Button>
            </HStack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Layout Components</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4}>
              <Box w="100%" p={4} bg="blue.50" borderRadius="md">
                <Text>This is a Box component with background color</Text>
              </Box>
              <HStack spacing={4} w="100%">
                <Box flex={1} p={4} bg="green.50" borderRadius="md">
                  <Text>Flex item 1</Text>
                </Box>
                <Box flex={1} p={4} bg="purple.50" borderRadius="md">
                  <Text>Flex item 2</Text>
                </Box>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}
