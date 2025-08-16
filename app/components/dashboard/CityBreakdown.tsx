import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Text,
  Flex,
  Box,
  Skeleton,
  Icon,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { MapPin } from "lucide-react";
import { Receivable, Payment } from "@/entities/all";

interface CityBreakdownProps {
  receivables: Receivable[];
  payments: Payment[];
  isLoading: boolean;
}

export default function CityBreakdown({ receivables, payments, isLoading }: CityBreakdownProps) {
  const calculateCityData = () => {
    const cityData: Record<string, { receivables: number; payments: number }> = {};

    receivables.forEach((r) => {
      // Ensure the city property exists on the receivable object
      if (!r.city) return;

      if (!cityData[r.city]) {
        cityData[r.city] = { receivables: 0, payments: 0 };
      }
      cityData[r.city].receivables += r.amount || 0;
    });

    payments.forEach((p) => {
      const receivable = receivables.find((r) => r.id === p.receivable_id);
      // Ensure the receivable exists and has a city property
      if (receivable && receivable.city && cityData[receivable.city]) {
        cityData[receivable.city].payments += p.payment_amount || 0;
      }
    });

    // Sort cities by receivable amount in descending order
    return Object.entries(cityData).sort(
      ([, a], [, b]) => b.receivables - a.receivables
    );
  };

  if (isLoading) {
    return (
      <Card bg="white" border="1px solid" borderColor="orange.200" borderRadius="lg">
        <CardHeader>
          <Flex align="center" gap={2}>
            <Icon as={MapPin} w="20px" h="20px" />
            <Text fontSize="lg" fontWeight="semibold">City Breakdown</Text>
          </Flex>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            {Array(2)
              .fill(0)
              .map((_, i) => (
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

  const cityData = calculateCityData();

  return (
    <Card bg="white" border="1px solid" borderColor="orange.200" borderRadius="lg">
      <CardHeader>
        <Flex align="center" gap={2}>
          <Icon as={MapPin} w="20px" h="20px" />
          <Text fontSize="lg" fontWeight="semibold">City Breakdown</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          {cityData.map(([city, data]) => (
            <Box
              key={city}
              p={4}
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.100"
              bgGradient="linear(to-r, gray.50, white)"
            >
              <Text fontSize="lg" fontWeight="semibold" color="gray.900" mb={3}>
                {city}
              </Text>
              <VStack spacing={2} align="stretch" fontSize="sm">
                <Flex justify="space-between">
                  <Text color="gray.600">Receivables:</Text>
                  <Text fontWeight="medium">
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
                    <Text fontWeight="semibold" color="orange.600">
                      {(data.receivables - data.payments).toLocaleString()} MMK
                    </Text>
                  </Flex>
                </Box>
              </VStack>
            </Box>
          ))}
        </VStack>
      </CardBody>
    </Card>
  );
}
