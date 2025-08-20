'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardBody,
  Flex,
  VStack,
  HStack,
  Text,
  Select,
  Input,
  Button,
  Icon,
  Skeleton,
} from '@chakra-ui/react';
import { Filter, Calendar, Users, MapPin } from 'lucide-react';

interface ReportFiltersProps {
  dateRange: { startDate: string; endDate: string };
  onDateRangeChange: (range: { startDate: string; endDate: string }) => void;
  selectedCustomer: string;
  onCustomerChange: (customer: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  receivables: any[];
  isLoading: boolean;
  onGenerateReport: () => void;
}

export default function ReportFilters({
  dateRange,
  onDateRangeChange,
  selectedCustomer,
  onCustomerChange,
  selectedCity,
  onCityChange,
  receivables,
  isLoading,
  onGenerateReport,
}: ReportFiltersProps) {
  const [customers, setCustomers] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [allReceivables, setAllReceivables] = useState<any[]>([]);

  // Fetch all receivables data for filter options when component mounts
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const { apiService } = await import('../../lib/api');
        const response = await apiService.getReceivables();
        const allData = response.data || [];
        setAllReceivables(allData);
        
        // Extract unique customers
        const uniqueCustomers = [...new Set(allData.map((r: any) => r.customer_name).filter(Boolean))].sort();
        setCustomers(uniqueCustomers);

        // Extract unique cities  
        const uniqueCities = [...new Set(allData.map((r: any) => r.city).filter(Boolean))].sort();
        setCities(uniqueCities);
      } catch (error) {
        console.error('Error loading filter data:', error);
      }
    };

    loadFilterData();
  }, []);

  const handleQuickDateSelect = (period: string) => {
    const today = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = today;
        break;
      case 'week':
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        startDate = new Date(today.getFullYear(), quarter * 3, 1);
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        return;
    }

    onDateRangeChange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
    });
  };

  const clearFilters = () => {
    onDateRangeChange({
      startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    });
    onCustomerChange('');
    onCityChange('');
  };

  if (isLoading) {
    return (
      <Card bg="white" border="1px solid" borderColor="orange.200" borderRadius="lg">
        <CardBody p={6}>
          <VStack spacing={4} align="stretch">
            <Skeleton height="20px" width="120px" />
            <HStack spacing={4}>
              <Skeleton height="40px" flex={1} />
              <Skeleton height="40px" flex={1} />
              <Skeleton height="40px" flex={1} />
              <Skeleton height="40px" flex={1} />
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card bg="white" border="1px solid" borderColor="orange.200" borderRadius="lg">
      <CardBody p={6}>
        <VStack spacing={4} align="stretch">
          <Flex align="center" gap={2}>
            <Icon as={Filter} w="20px" h="20px" color="orange.500" />
            <Text fontSize="lg" fontWeight="semibold" color="gray.900">
              Report Filters
            </Text>
          </Flex>

          {/* Date Range */}
          <Box>
            <Flex align="center" gap={2} mb={3}>
              <Icon as={Calendar} w="16px" h="16px" color="gray.600" />
              <Text fontSize="sm" fontWeight="medium" color="gray.700">
                Date Range
              </Text>
            </Flex>
            <HStack spacing={3}>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => onDateRangeChange({ ...dateRange, startDate: e.target.value })}
                size="sm"
                borderRadius="md"
              />
              <Text color="gray.500">to</Text>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => onDateRangeChange({ ...dateRange, endDate: e.target.value })}
                size="sm"
                borderRadius="md"
              />
            </HStack>
            
            {/* Quick Date Buttons */}
            <HStack spacing={2} mt={3} flexWrap="wrap">
              <Button size="xs" variant="outline" onClick={() => handleQuickDateSelect('today')}>
                Today
              </Button>
              <Button size="xs" variant="outline" onClick={() => handleQuickDateSelect('week')}>
                This Week
              </Button>
              <Button size="xs" variant="outline" onClick={() => handleQuickDateSelect('month')}>
                This Month
              </Button>
              <Button size="xs" variant="outline" onClick={() => handleQuickDateSelect('quarter')}>
                This Quarter
              </Button>
              <Button size="xs" variant="outline" onClick={() => handleQuickDateSelect('year')}>
                This Year
              </Button>
            </HStack>
          </Box>

          {/* Customer and City Filters */}
          <HStack spacing={4}>
            <Box flex={1}>
              <Flex align="center" gap={2} mb={2}>
                <Icon as={Users} w="16px" h="16px" color="gray.600" />
                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                  Customer
                </Text>
              </Flex>
              <Select
                value={selectedCustomer}
                onChange={(e) => onCustomerChange(e.target.value)}
                placeholder="All Customers"
                size="sm"
                borderRadius="md"
              >
                {customers.map((customer) => (
                  <option key={customer} value={customer}>
                    {customer}
                  </option>
                ))}
              </Select>
            </Box>

            <Box flex={1}>
              <Flex align="center" gap={2} mb={2}>
                <Icon as={MapPin} w="16px" h="16px" color="gray.600" />
                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                  City
                </Text>
              </Flex>
              <Select
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                placeholder="All Cities"
                size="sm"
                borderRadius="md"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
            </Box>
          </HStack>

          {/* Action Buttons */}
          <Flex justify="space-between" align="center">
            <Button
              size="sm"
              variant="ghost"
              color="gray.600"
              onClick={clearFilters}
              _hover={{ bg: 'gray.100' }}
            >
              Clear All Filters
            </Button>
            <Button
              size="md"
              colorScheme="orange"
              onClick={onGenerateReport}
              isLoading={isLoading}
              loadingText="Generating..."
              leftIcon={<Icon as={Filter} w="16px" h="16px" />}
              _hover={{ bg: 'orange.600' }}
            >
              Generate Report
            </Button>
          </Flex>
        </VStack>
      </CardBody>
    </Card>
  );
}
