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
import { CreditCard, Calendar } from 'lucide-react';

interface PaymentTrendsProps {
  payments: any[];
  isLoading: boolean;
}

export default function PaymentTrends({
  payments,
  isLoading,
}: PaymentTrendsProps) {
  const calculatePaymentData = () => {
    const paymentTypes: { [key: string]: number } = {};
    const dailyPayments: { [key: string]: number } = {};
    let totalPayments = 0;

    payments.forEach((p) => {
      if (!p || typeof p.payment_amount !== 'number') return;
      
      // Count payment types
      const type = p.payment_type || 'Unknown';
      paymentTypes[type] = (paymentTypes[type] || 0) + p.payment_amount;

      // Count daily payments
      if (p.payment_date) {
        const date = new Date(p.payment_date);
        if (!isNaN(date.getTime())) {
          const dateKey = date.toISOString().split('T')[0];
          dailyPayments[dateKey] = (dailyPayments[dateKey] || 0) + p.payment_amount;
        }
      }

      totalPayments += p.payment_amount;
    });

    // Get top payment types
    const topPaymentTypes = Object.entries(paymentTypes)
      .map(([type, amount]) => ({ type, amount, percentage: (amount / totalPayments) * 100 }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Get recent daily payments (last 7 days)
    const recentDailyPayments = Object.entries(dailyPayments)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 7);

    return {
      topPaymentTypes,
      recentDailyPayments,
      totalPayments,
    };
  };

  const formatDate = (dateKey: string) => {
    const date = new Date(dateKey);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const paymentData = calculatePaymentData();

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
              <Box key={i} p={3} borderRadius="lg" border="1px solid" borderColor="gray.200">
                <Skeleton height="16px" width="80px" mb={2} />
                <Skeleton height="8px" width="100%" mb={1} />
                <Skeleton height="14px" width="60px" />
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
          <CreditCard size={20} className="text-orange-500" />
          <Text fontSize="lg" fontWeight="semibold">Payment Trends</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          {paymentData.topPaymentTypes.length === 0 ? (
            <Box p={6} textAlign="center" color="gray.500">
              <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
              <Text>No payment data available</Text>
            </Box>
          ) : (
            <>
              {/* Payment Types Breakdown */}
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={3}>
                  Payment Methods
                </Text>
                <VStack spacing={3} align="stretch">
                  {paymentData.topPaymentTypes.map((item, index) => (
                    <Box key={item.type}>
                      <Flex justify="space-between" align="center" mb={1}>
                        <Text fontSize="sm" color="gray.600">
                          {item.type}
                        </Text>
                        <Text fontSize="sm" fontWeight="medium" color="gray.900">
                          {item.amount.toLocaleString()} MMK
                        </Text>
                      </Flex>
                      <Progress
                        value={item.percentage}
                        size="sm"
                        colorScheme="orange"
                        borderRadius="full"
                        bg="gray.100"
                      />
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {item.percentage.toFixed(1)}% of total payments
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </Box>

              {/* Recent Daily Payments */}
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={3}>
                  Recent Daily Collections
                </Text>
                <VStack spacing={2} align="stretch">
                  {paymentData.recentDailyPayments.map((item) => (
                    <Box
                      key={item.date}
                      p={3}
                      borderRadius="md"
                      border="1px solid"
                      borderColor="gray.100"
                      bg="gray.50"
                    >
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm" color="gray.600">
                          {formatDate(item.date)}
                        </Text>
                        <Text fontSize="sm" fontWeight="semibold" color="green.600">
                          {item.amount.toLocaleString()} MMK
                        </Text>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              </Box>

              {/* Summary */}
              <Box p={3} borderRadius="md" bg="orange.50" border="1px solid" borderColor="orange.200">
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" fontWeight="medium" color="orange.800">
                    Total Collections
                  </Text>
                  <Badge colorScheme="orange" variant="solid" fontSize="sm">
                    {paymentData.totalPayments.toLocaleString()} MMK
                  </Badge>
                </Flex>
              </Box>
            </>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
