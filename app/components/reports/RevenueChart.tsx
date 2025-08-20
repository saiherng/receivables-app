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
  HStack,
  Badge,
} from '@chakra-ui/react';
import { TrendingUp, Calendar } from 'lucide-react';

interface RevenueChartProps {
  receivables: any[];
  payments: any[];
  isLoading: boolean;
}

export default function RevenueChart({
  receivables,
  payments,
  isLoading,
}: RevenueChartProps) {
  const calculateMonthlyData = () => {
    const monthlyData: { [key: string]: { receivables: number; payments: number } } = {};

    // Process receivables
    receivables.forEach((r) => {
      if (!r || !r.date || typeof r.amount !== 'number') return;
      
      const date = new Date(r.date);
      if (isNaN(date.getTime())) return;
      
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { receivables: 0, payments: 0 };
      }
      monthlyData[monthKey].receivables += r.amount;
    });

    // Process payments
    payments.forEach((p) => {
      if (!p || !p.payment_date || typeof p.payment_amount !== 'number') return;
      
      const date = new Date(p.payment_date);
      if (isNaN(date.getTime())) return;
      
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { receivables: 0, payments: 0 };
      }
      monthlyData[monthKey].payments += p.payment_amount;
    });

    // Convert to array and sort by date
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        ...data,
        outstanding: data.receivables - data.payments,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Show last 6 months
  };

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const monthlyData = calculateMonthlyData();

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
            {Array(6).fill(0).map((_, i) => (
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
          <TrendingUp size={20} className="text-orange-500" />
          <Text fontSize="lg" fontWeight="semibold">Revenue Trends</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          {monthlyData.length === 0 ? (
            <Box p={6} textAlign="center" color="gray.500">
              <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
              <Text>No data available for the selected period</Text>
            </Box>
          ) : (
            monthlyData.map((data) => (
              <Box
                key={data.month}
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
                    {formatMonth(data.month)}
                  </Text>
                  <Badge
                    colorScheme={data.outstanding > 0 ? 'orange' : 'green'}
                    variant="subtle"
                    fontSize="xs"
                  >
                    {data.outstanding > 0 ? 'Outstanding' : 'Fully Paid'}
                  </Badge>
                </Flex>
                
                <VStack spacing={2} align="stretch" fontSize="sm">
                  <Flex justify="space-between">
                    <Text color="gray.600">Receivables:</Text>
                    <Text fontWeight="medium" color="blue.600">
                      {data.receivables.toLocaleString()} MMK
                    </Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text color="gray.600">Payments:</Text>
                    <Text fontWeight="medium" color="green.600">
                      {data.payments.toLocaleString()} MMK
                    </Text>
                  </Flex>
                  <Box pt={2} borderTop="1px solid" borderColor="gray.200">
                    <Flex justify="space-between">
                      <Text color="gray.600">Outstanding:</Text>
                      <Text 
                        fontWeight="semibold" 
                        color={data.outstanding > 0 ? 'orange.600' : 'green.600'}
                      >
                        {data.outstanding.toLocaleString()} MMK
                      </Text>
                    </Flex>
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
