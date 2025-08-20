'use client';
import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Text,
  Flex,
  Box,
  Skeleton,
  VStack,
  Badge,
  Progress,
} from '@chakra-ui/react';
import { Users, TrendingUp } from 'lucide-react';

interface CustomerPerformanceProps {
  receivables: any[];
  payments: any[];
  isLoading: boolean;
}

export default function CustomerPerformance({
  receivables,
  payments,
  isLoading,
}: CustomerPerformanceProps) {
  const calculateCustomerData = () => {
    const customerData: { [key: string]: { receivables: number; payments: number; outstanding: number } } = {};

    // Process receivables
    receivables.forEach((r) => {
      const customer = r.customer_name;
      if (!customerData[customer]) {
        customerData[customer] = { receivables: 0, payments: 0, outstanding: 0 };
      }
      customerData[customer].receivables += r.amount || 0;
    });

    // Process payments
    payments.forEach((p) => {
      const receivable = receivables.find((r) => r.id === p.receivable_id);
      if (receivable) {
        const customer = receivable.customer_name;
        if (customerData[customer]) {
          customerData[customer].payments += p.payment_amount || 0;
        }
      }
    });

    // Calculate outstanding amounts
    Object.keys(customerData).forEach((customer) => {
      customerData[customer].outstanding = 
        customerData[customer].receivables - customerData[customer].payments;
    });

    // Convert to array and calculate performance metrics
    return Object.entries(customerData)
      .map(([customer, data]) => ({
        customer,
        ...data,
        collectionRate: data.receivables > 0 ? (data.payments / data.receivables) * 100 : 0,
      }))
      .sort((a, b) => b.receivables - a.receivables)
      .slice(0, 10); // Top 10 customers by receivables
  };

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return 'green';
    if (rate >= 60) return 'yellow';
    return 'red';
  };

  const customerData = calculateCustomerData();

  if (isLoading) {
    return (
      <Card bg="white" border="1px solid" borderColor="orange.200" borderRadius="lg">
        <CardHeader>
          <Flex align="center" gap={2}>
            <Skeleton width="20px" height="20px" />
            <Skeleton height="20px" width="120px" />
          </Flex>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            {Array(5).fill(0).map((_, i) => (
              <Box key={i} p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
                <Skeleton height="20px" width="80px" mb={3} />
                <VStack spacing={2} align="stretch">
                  <Flex justify="space-between">
                    <Skeleton height="16px" width="64px" />
                    <Skeleton height="16px" width="80px" />
                  </Flex>
                  <Flex justify="space-between">
                    <Skeleton height="16px" width="48px" />
                    <Skeleton height="16px" width="80px" />
                  </Flex>
                  <Flex justify="space-between">
                    <Skeleton height="16px" width="64px" />
                    <Skeleton height="16px" width="80px" />
                  </Flex>
                </VStack>
              </Box>
            ))}
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card bg="white" border="1px solid" borderColor="orange.200" borderRadius="lg">
      <CardHeader>
        <Flex align="center" gap={2}>
          <Users size={20} className="text-orange-500" />
          <Text fontSize="lg" fontWeight="semibold">Customer Performance</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          {customerData.length === 0 ? (
            <Box p={6} textAlign="center" color="gray.500">
              <Users size={48} className="mx-auto mb-4 text-gray-300" />
              <Text>No customer data available</Text>
            </Box>
          ) : (
            customerData.map((item, index) => (
              <Box
                key={item.customer}
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.100"
                bgGradient="linear(to-r, gray.50, white)"
                _hover={{ bg: 'gray.50' }}
                transition="all 0.2s"
              >
                <Flex justify="space-between" align="center" mb={3}>
                  <Text fontSize="lg" fontWeight="semibold" color="gray.900">
                    {item.customer}
                  </Text>
                  <Badge
                    colorScheme={getPerformanceColor(item.collectionRate)}
                    variant="subtle"
                    fontSize="xs"
                  >
                    {item.collectionRate.toFixed(1)}% Collection
                  </Badge>
                </Flex>
                
                <VStack spacing={2} align="stretch" fontSize="sm">
                  <Flex justify="space-between">
                    <Text color="gray.600">Receivables:</Text>
                    <Text fontWeight="medium" color="blue.600">
                      {item.receivables.toLocaleString()} MMK
                    </Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text color="gray.600">Payments:</Text>
                    <Text fontWeight="medium" color="green.600">
                      {item.payments.toLocaleString()} MMK
                    </Text>
                  </Flex>
                  <Box pt={2} borderTop="1px solid" borderColor="gray.200">
                    <Flex justify="space-between" mb={2}>
                      <Text color="gray.600">Outstanding:</Text>
                      <Text 
                        fontWeight="semibold" 
                        color={item.outstanding > 0 ? 'orange.600' : 'green.600'}
                      >
                        {item.outstanding.toLocaleString()} MMK
                      </Text>
                    </Flex>
                    <Progress
                      value={item.collectionRate}
                      size="sm"
                      colorScheme={getPerformanceColor(item.collectionRate)}
                      borderRadius="full"
                      bg="gray.100"
                    />
                  </Box>
                </VStack>
              </Box>
            ))
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
