import React from "react";
import {
  Card,
  CardBody,
  Text,
  Flex,
  Box,
  Input,
  Select,
  Button,
  Icon,
  VStack,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Search, Filter, X } from "lucide-react";
import { Receivable } from "@/entities/all";

interface PaymentFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
  customers?: string[];
  paymentTypes?: string[];
  receivables?: any[];
}

export default function PaymentFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  customers = [],
  paymentTypes = [],
  receivables = [],
}: PaymentFiltersProps) {
  const handleFilterChange = (field: string, value: string) => {
    onFiltersChange((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Get unique customers from receivables
  const uniqueCustomers = [
    ...new Set(receivables.map((r) => r.customer_name).filter(Boolean)),
  ].sort();

  // Get unique payment types
  const uniquePaymentTypes = [...new Set(paymentTypes)].sort();

  return (
    <Card mb={6} bg="white" border="1px solid" borderColor="green.200" borderRadius="lg">
      <CardBody p={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Flex align="center" gap={2}>
            <Icon as={Filter} w="20px" h="20px" color="green.600" />
            <Text fontSize="lg" fontWeight="semibold" color="gray.900">Filters</Text>
          </Flex>
          <Button
            onClick={onClearFilters}
            variant="ghost"
            size="sm"
            color="green.700"
            _hover={{ bg: "green.100" }}
          >
            <Icon as={X} w="16px" h="16px" mr={1.5} />
            Clear Filters
          </Button>
        </Flex>
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
          <GridItem>
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="medium">Customer</Text>
              <Box position="relative">
                <Icon 
                  as={Search} 
                  position="absolute" 
                  left={3} 
                  top="50%" 
                  transform="translateY(-50%)" 
                  color="gray.400" 
                  w="16px" 
                  h="16px" 
                />
                <Input
                  placeholder="Search customers..."
                  value={filters.customer}
                  onChange={(e) => handleFilterChange("customer", e.target.value)}
                  pl={9}
                />
              </Box>
            </VStack>
          </GridItem>
          <GridItem>
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="medium">Payment Type</Text>
              <Select
                value={filters.paymentType}
                onChange={(e) => handleFilterChange("paymentType", e.target.value)}
              >
                <option value="all">All Payment Types</option>
                {uniquePaymentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </VStack>
          </GridItem>
          <GridItem>
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="medium">From Date</Text>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              />
            </VStack>
          </GridItem>
          <GridItem>
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="medium">To Date</Text>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              />
            </VStack>
          </GridItem>
        </Grid>
      </CardBody>
    </Card>
  );
}
