import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Text,
  Button,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Box,
  VStack,
  HStack,
  Icon,
  Skeleton,
} from "@chakra-ui/react";
import {
  Users,
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import CustomerDetail from "./CustomerDetail";

interface CustomerListProps {
  customers: any[];
  isLoading: boolean;
  onRefresh?: () => void;
}

export default function CustomerList({
  customers,
  isLoading,
  onRefresh,
}: CustomerListProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Update selectedCustomer when customers array changes
  useEffect(() => {
    if (selectedCustomer && customers.length > 0) {
      const updatedCustomer = customers.find(c => c.name === selectedCustomer.name);
      if (updatedCustomer) {
        setSelectedCustomer(updatedCustomer);
      }
    }
  }, [customers, selectedCustomer]);
  if (isLoading) {
    return (
      <Card bg="white" border="1px solid" borderColor="orange.200" borderRadius="lg">
        <CardHeader>
          <Flex align="center" gap={2}>
            <Icon as={Users} w="20px" h="20px" />
            <Text fontSize="lg" fontWeight="semibold">Customer Balances</Text>
          </Flex>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Flex key={i} align="center" gap={4} p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Box flex="1">
                    <Skeleton height="16px" width="128px" mb={2} />
                    <Skeleton height="16px" width="96px" />
                  </Box>
                  <Skeleton height="32px" width="80px" />
                </Flex>
              ))}
          </VStack>
        </CardBody>
      </Card>
    );
  }

  const StatusBadge = ({ customer }: { customer: any }) => {
    const isFullyPaid = customer.outstandingBalance <= 0;
    return (
      <Badge
        variant="outline"
        colorScheme={isFullyPaid ? "green" : "orange"}
      >
        {isFullyPaid ? "Paid in Full" : "Has Outstanding"}
      </Badge>
    );
  };

  return (
    <>
      <Card bg="white" border="1px solid" borderColor="orange.200" borderRadius="lg">
      <CardHeader>
        <Flex align="center" gap={2}>
          <Icon as={Users} w="20px" h="20px" />
          <Text fontSize="lg" fontWeight="semibold">Customer Balances ({customers.length})</Text>
        </Flex>
      </CardHeader>
      <CardBody p={{ base: 4, md: 6 }}>
        {/* Mobile View */}
        <Box display={{ base: "block", md: "none" }}>
          <VStack spacing={4} align="stretch">
            <AnimatePresence>
              {customers.map((customer: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card border="1px solid" borderColor="orange.200" borderRadius="lg" overflow="hidden">
                    <CardHeader pb={3} p={4} >
                      <Flex justify="space-between" align="start" gap={3}>
                        <Box minW={0} flex={1}>
                          <Text fontSize="lg" fontWeight="bold" color="gray.900" noOfLines={1}>
                            {customer.name}
                          </Text>
                        </Box>
                        <StatusBadge customer={customer} />
                      </Flex>
                      <Flex flexWrap="wrap" gap={1} mt={2}>
                        {customer.cities.slice(0, 3).map((city: string) => (
                          <Badge
                            key={city}
                            variant="outline"
                            fontSize="xs"
                            fontWeight="normal"
                          >
                            {city}
                          </Badge>
                        ))}
                        {customer.cities.length > 3 && (
                          <Badge
                            variant="outline"
                            fontSize="xs"
                            fontWeight="normal"
                          >
                            +{customer.cities.length - 3}
                          </Badge>
                        )}
                      </Flex>
                    </CardHeader>
                    <CardBody fontSize="sm" p={4} pt={0}>
                      <VStack spacing={2} align="stretch">
                        <Flex justify="space-between" align="center" gap={4}>
                          <Flex align="center" gap={1.5} color="gray.600" fontSize="xs" flexShrink={0}>
                            <Icon as={TrendingUp} w="12px" h="12px" color="blue.600" flexShrink={0} />
                            Receivables
                          </Flex>
                          <Text fontWeight="medium" fontSize="sm" textAlign="right" noOfLines={1}>
                            {customer.totalReceivables.toLocaleString()} MMK
                          </Text>
                        </Flex>
                        <Flex justify="space-between" align="center" gap={4}>
                          <Flex align="center" gap={1.5} color="gray.600" fontSize="xs" flexShrink={0}>
                            <Icon as={TrendingDown} w="12px" h="12px" color="green.600" flexShrink={0} />
                            Paid
                          </Flex>
                          <Text fontWeight="medium" color="green.600" fontSize="sm" textAlign="right" noOfLines={1}>
                            {customer.totalPaid.toLocaleString()} MMK
                          </Text>
                        </Flex>
                        <Flex justify="space-between" align="center" pt={2} borderTop="1px solid" borderColor="gray.200" mt={2} gap={4}>
                          <Text fontWeight="semibold" color="gray.600" fontSize="xs" flexShrink={0}>
                            Outstanding
                          </Text>
                          <Text
                            fontWeight="bold"
                            fontSize="sm"
                            textAlign="right"
                            noOfLines={1}
                            color={customer.outstandingBalance > 0 ? "orange.600" : "green.600"}
                          >
                            {customer.outstandingBalance.toLocaleString()} MMK
                          </Text>
                        </Flex>
                      </VStack>
                    </CardBody>
                    <CardFooter bg="gray.50" p={4} pt={3}>
                      <Flex justify="end" gap={2}>
                        <Button
                          size="sm"
                          variant="outline"
                          colorScheme="orange"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowDetail(true);
                          }}
                        >
                          <Icon as={Eye} w="16px" h="16px" mr={2} />
                          View Details
                        </Button>
                      </Flex>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </VStack>
        </Box>

        {/* Desktop View */}
        <Box display={{ base: "none", md: "block" }} overflowX="auto">
          <Table>
            <Thead>
              <Tr>
                <Th>Customer Name</Th>
                <Th>Cities</Th>
                <Th>Total Receivables</Th>
                <Th>Total Paid</Th>
                <Th>Outstanding Balance</Th>
                <Th>Status</Th>
                <Th textAlign="right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {customers.map((customer: any, index: number) => (
                <Tr
                  key={index}
                  _hover={{ bg: "orange.50" }}
                  transition="colors"
                >
                  <Td
                    fontWeight="medium"
                    _hover={{ color: "orange.600" }}
                  >
                    {customer.name}
                  </Td>
                  <Td
                    
  
                  >
                    <Flex flexWrap="wrap" gap={1} maxW="xs">
                      {customer.cities.map((city: string) => (
                        <Badge
                          key={city}
                          variant="outline"
                          fontWeight="normal"
                        >
                          {city}
                        </Badge>
                      ))}
                    </Flex>
                  </Td>
                  <Td
                    
                    fontWeight="semibold"
                    
                  >
                    {customer.totalReceivables.toLocaleString()} MMK
                  </Td>
                  <Td
                    
                    fontWeight="semibold"
                    color="green.600"
                    
                  >
                    {customer.totalPaid.toLocaleString()} MMK
                  </Td>
                  <Td
                    
                    fontWeight="semibold"
                   
                    color={customer.outstandingBalance > 0 ? "orange.600" : "green.600"}
                  >
                    {customer.outstandingBalance.toLocaleString()} MMK
                  </Td>
                  <Td>
                    <StatusBadge customer={customer} />
                  </Td>
                  <Td textAlign="right">
                    <Flex justify="end" gap={1}>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="orange"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowDetail(true);
                        }}
                      >
                        <Icon as={Eye} w="16px" h="16px" mr={2} />
                        Details
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </Card>

    {/* Customer Detail Modal */}
    <AnimatePresence>
      {showDetail && selectedCustomer && (
                 <CustomerDetail
           customer={selectedCustomer}
           onClose={() => {
             setShowDetail(false);
             setSelectedCustomer(null);
           }}
                       onEditPayment={(payment) => {
              // Handle edit payment - could navigate to payments page
            }}
           onDeletePayment={async (paymentId) => {
             // Handle delete payment
             try {
               const response = await fetch(`/api/payments/${paymentId}`, {
                 method: 'DELETE',
               });
               
               if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.error || 'Failed to delete payment');
               }
               
               // Refresh the customer data when a payment is deleted
               if (onRefresh) {
                 onRefresh();
               }
             } catch (error: any) {
               console.error('Error deleting payment:', error);
             }
           }}
           onPaymentAdded={() => {
             // Refresh the customer data when a payment is added
             if (onRefresh) {
               onRefresh();
             }
           }}
         />
      )}
    </AnimatePresence>
    </>
  );
}
