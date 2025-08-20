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
import { MapPin, TrendingUp } from 'lucide-react';
import { getCityBadgeProps } from '../../lib/city-utils';

interface CityAnalysisProps {
  receivables: any[];
  payments: any[];
  isLoading: boolean;
}

export default function CityAnalysis({
  receivables,
  payments,
  isLoading,
}: CityAnalysisProps) {
  const calculateCityData = () => {
    const cityData: { [key: string]: { receivables: number; payments: number; outstanding: number } } = {};

    // Process receivables
    receivables.forEach((r) => {
      const city = r.city;
      if (!cityData[city]) {
        cityData[city] = { receivables: 0, payments: 0, outstanding: 0 };
      }
      cityData[city].receivables += r.amount || 0;
    });

    // Process payments
    payments.forEach((p) => {
      const receivable = receivables.find((r) => r.id === p.receivable_id);
      if (receivable) {
        const city = receivable.city;
        if (cityData[city]) {
          cityData[city].payments += p.payment_amount || 0;
        }
      }
    });

    // Calculate outstanding amounts
    Object.keys(cityData).forEach((city) => {
      cityData[city].outstanding = 
        cityData[city].receivables - cityData[city].payments;
    });

    // Convert to array and calculate performance metrics
    return Object.entries(cityData)
      .map(([city, data]) => ({
        city,
        ...data,
        collectionRate: data.receivables > 0 ? (data.payments / data.receivables) * 100 : 0,
      }))
      .sort((a, b) => b.receivables - a.receivables)
      .slice(0, 10); // Top 10 cities by receivables
  };

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return 'green';
    if (rate >= 60) return 'yellow';
    return 'red';
  };

  const cityData = calculateCityData();

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
          <MapPin size={20} className="text-orange-500" />
          <Text fontSize="lg" fontWeight="semibold">City Analysis</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          {cityData.length === 0 ? (
            <Box p={6} textAlign="center" color="gray.500">
              <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
              <Text>No city data available</Text>
            </Box>
          ) : (
            cityData.map((item, index) => (
              <Box
                key={item.city}
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.100"
                bgGradient="linear(to-r, gray.50, white)"
                _hover={{ bg: 'gray.50' }}
                transition="all 0.2s"
              >
                <Flex justify="space-between" align="center" mb={3}>
                  <Flex align="center" gap={2}>
                    <Badge {...getCityBadgeProps(item.city)}>
                      {item.city}
                    </Badge>
                  </Flex>
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
