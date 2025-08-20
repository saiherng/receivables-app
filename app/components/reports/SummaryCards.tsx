'use client';
import React from 'react';
import {
  Grid,
  GridItem,
  Card,
  CardBody,
  Flex,
  VStack,
  Text,
  Icon,
  Skeleton,
  Badge,
  Box,
} from '@chakra-ui/react';
import { Receipt, CreditCard, TrendingUp, Percent } from 'lucide-react';

interface SummaryCardsProps {
  totalReceivables: number;
  totalPaid: number;
  outstandingBalance: number;
  collectionRate: number;
  isLoading: boolean;
}

export default function SummaryCards({
  totalReceivables,
  totalPaid,
  outstandingBalance,
  collectionRate,
  isLoading,
}: SummaryCardsProps) {
  const getCollectionRateColor = (rate: number) => {
    if (rate >= 80) return 'green';
    if (rate >= 60) return 'yellow';
    return 'red';
  };

  const getOutstandingBalanceColor = (balance: number) => {
    return balance > 0 ? 'orange' : 'green';
  };

  if (isLoading) {
    return (
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
        {Array(4).fill(0).map((_, i) => (
          <GridItem key={i}>
            <Card bg="white" border="1px solid" borderColor="orange.200" borderRadius="lg">
              <CardBody p={6}>
                <Flex justify="space-between" align="center">
                  <Box>
                    <Skeleton height="16px" width="80px" mb={2} />
                    <Skeleton height="32px" width="96px" />
                  </Box>
                  <Skeleton width="48px" height="48px" borderRadius="xl" />
                </Flex>
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </Grid>
    );
  }

  return (
    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
      {/* Total Receivables */}
      <GridItem>
        <Card 
          bg="white" 
          border="1px solid" 
          borderColor="orange.200" 
          borderRadius="lg"
          _hover={{ boxShadow: "lg" }}
          transition="all 0.3s"
        >
          <CardBody p={6}>
            <Flex justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  Total Receivables
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  {totalReceivables.toLocaleString()} MMK
                </Text>
                <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                  Generated
                </Badge>
              </VStack>
              <Box
                p={3}
                borderRadius="xl"
                bgGradient="linear(to-br, blue.500, blue.600)"
                boxShadow="lg"
              >
                <Icon as={Receipt} w="24px" h="24px" color="white" />
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </GridItem>

      {/* Total Paid */}
      <GridItem>
        <Card 
          bg="white" 
          border="1px solid" 
          borderColor="orange.200" 
          borderRadius="lg"
          _hover={{ boxShadow: "lg" }}
          transition="all 0.3s"
        >
          <CardBody p={6}>
            <Flex justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  Total Paid
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                  {totalPaid.toLocaleString()} MMK
                </Text>
                <Badge colorScheme="green" variant="subtle" fontSize="xs">
                  Collected
                </Badge>
              </VStack>
              <Box
                p={3}
                borderRadius="xl"
                bgGradient="linear(to-br, green.500, green.600)"
                boxShadow="lg"
              >
                <Icon as={CreditCard} w="24px" h="24px" color="white" />
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </GridItem>

      {/* Outstanding Balance */}
      <GridItem>
        <Card 
          bg="white" 
          border="1px solid" 
          borderColor="orange.200" 
          borderRadius="lg"
          _hover={{ boxShadow: "lg" }}
          transition="all 0.3s"
        >
          <CardBody p={6}>
            <Flex justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  Outstanding Balance
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color={`${getOutstandingBalanceColor(outstandingBalance)}.600`}>
                  {outstandingBalance.toLocaleString()} MMK
                </Text>
                <Badge 
                  colorScheme={getOutstandingBalanceColor(outstandingBalance)} 
                  variant="subtle" 
                  fontSize="xs"
                >
                  {outstandingBalance > 0 ? 'Pending' : 'Fully Paid'}
                </Badge>
              </VStack>
              <Box
                p={3}
                borderRadius="xl"
                bgGradient={`linear(to-br, ${getOutstandingBalanceColor(outstandingBalance)}.500, ${getOutstandingBalanceColor(outstandingBalance)}.600)`}
                boxShadow="lg"
              >
                <Icon as={TrendingUp} w="24px" h="24px" color="white" />
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </GridItem>

      {/* Collection Rate */}
      <GridItem>
        <Card 
          bg="white" 
          border="1px solid" 
          borderColor="orange.200" 
          borderRadius="lg"
          _hover={{ boxShadow: "lg" }}
          transition="all 0.3s"
        >
          <CardBody p={6}>
            <Flex justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  Collection Rate
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color={`${getCollectionRateColor(collectionRate)}.600`}>
                  {collectionRate.toFixed(1)}%
                </Text>
                <Badge 
                  colorScheme={getCollectionRateColor(collectionRate)} 
                  variant="subtle" 
                  fontSize="xs"
                >
                  {collectionRate >= 80 ? 'Excellent' : collectionRate >= 60 ? 'Good' : 'Needs Attention'}
                </Badge>
              </VStack>
              <Box
                p={3}
                borderRadius="xl"
                bgGradient={`linear(to-br, ${getCollectionRateColor(collectionRate)}.500, ${getCollectionRateColor(collectionRate)}.600)`}
                boxShadow="lg"
              >
                <Icon as={Percent} w="24px" h="24px" color="white" />
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
}
