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
  HStack,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Search, Filter, X } from "lucide-react";


const PREDEFINED_CITIES = [
  "Yangon",
  "Mandalay",
  "Naypyidaw",
  "Taunggyi",
  "Bago",
  "Mawlamyine",
  "Pathein",
  "Monywa",
  "Sittwe",
  "Myitkyina",
  "Lashio",
  "Hpa-an",
  "Dawei",
  "Pyay",
  "Magway",
  "Pakokku",
  "Loikaw",
  "Hakha",
];

interface FilterBarProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  customers: string[];
  onClearFilters: () => void;
  receivables?: any[];
}

export default function FilterBar({
  filters,
  onFiltersChange,
  customers,
  onClearFilters,
  receivables = [],
}: FilterBarProps) {
  const handleFilterChange = (field: string, value: string) => {
    onFiltersChange((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Get unique cities from existing receivables
  const existingCities = [
    ...new Set(receivables.map((r) => r.city).filter(Boolean)),
  ];
  const allAvailableCities = [
    ...new Set([...PREDEFINED_CITIES, ...existingCities]),
  ].sort();

  return (
    <Card mb={6} bg="white" border="1px solid" borderColor="orange.200" borderRadius="lg">
      <CardBody p={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Flex align="center" gap={2}>
            <Icon as={Filter} w="20px" h="20px" color="orange.600" />
            <Text fontSize="lg" fontWeight="semibold" color="gray.900">Filters</Text>
          </Flex>
          <Button
            onClick={onClearFilters}
            variant="ghost"
            size="sm"
            color="orange.700"
            _hover={{ bg: "orange.100" }}
          >
            <Icon as={X} w="16px" h="16px" mr={1.5} />
            Clear Filters
          </Button>
        </Flex>
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(5, 1fr)" }} gap={4}>
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
              <Text fontSize="sm" fontWeight="medium">City</Text>
              <Select
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
              >
                <option value="all">All Cities</option>
                {allAvailableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
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
          <GridItem>
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="medium">Status</Text>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
              </Select>
            </VStack>
          </GridItem>
        </Grid>
      </CardBody>
    </Card>
  );
}
