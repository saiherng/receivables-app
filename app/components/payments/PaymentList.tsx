import React from "react";
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
  CreditCard,
  Edit,
  Trash2,
  Calendar,
  User,
  Tag,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

interface PaymentListProps {
  payments: any[];
  getReceivableById: (id: string) => any;
  isLoading: boolean;
  onEdit: (payment: any) => void;
  onDelete: (paymentId: string) => void;
}

export default function PaymentList({
  payments,
  getReceivableById,
  isLoading,
  onEdit,
  onDelete,
}: PaymentListProps) {
  if (isLoading) {
    return (
      <Card bg="white" border="1px solid" borderColor="green.200" borderRadius="lg">
        <CardHeader>
          <Flex align="center" gap={2}>
            <Icon as={CreditCard} w="20px" h="20px" />
            <Text fontSize="lg" fontWeight="semibold">Payment History</Text>
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

  const sortedPayments = [...payments].sort((a, b) => {
    const dateComparison = new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime();
    if (dateComparison !== 0) return dateComparison;
    return new Date(b.created_date).getTime() - new Date(a.created_date).getTime();
  });

  return (
    <Card bg="white" border="1px solid" borderColor="green.200" borderRadius="lg">
      <CardHeader>
        <Flex align="center" gap={2}>
          <Icon as={CreditCard} w="20px" h="20px" />
          <Text fontSize="lg" fontWeight="semibold">Payment History ({payments.length})</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        {/* Mobile View */}
        <Box display={{ base: "block", md: "none" }}>
          <VStack spacing={4} align="stretch">
            <AnimatePresence>
              {sortedPayments.map((payment) => {
                const receivable = getReceivableById(payment.receivable_id);
                return (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card border="1px solid" borderColor="green.200" borderRadius="lg">
                      <CardHeader pb={4}>
                        <Flex justify="space-between" align="start">
                          <Box>
                            <Text fontSize="lg" fontWeight="bold" color="green.800">
                              {(payment.payment_amount || 0).toLocaleString()} MMK
                            </Text>
                            <Flex align="center" gap={1.5} fontSize="sm" color="gray.500">
                              <Icon as={User} w="12px" h="12px" />
                              {receivable?.customer_name || "Unknown"}
                            </Flex>
                          </Box>
                          <Badge
                            variant="outline"
                            borderColor="green.200"
                            color="green.700"
                          >
                            {payment.payment_type}
                          </Badge>
                        </Flex>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={2} align="stretch" fontSize="sm">
                          <Flex justify="space-between" align="center">
                            <Flex align="center" gap={2} color="gray.600">
                              <Icon as={Calendar} w="16px" h="16px" />
                              Payment Date
                            </Flex>
                            <Text fontWeight="medium">
                              {format(
                                new Date(payment.payment_date),
                                "MMM d, yyyy"
                              )}
                            </Text>
                          </Flex>
                          <Flex justify="space-between" align="center">
                            <Flex align="center" gap={2} color="gray.600">
                              <Icon as={FileText} w="16px" h="16px" />
                              Notes
                            </Flex>
                            <Text color="gray.800" maxW="60%" noOfLines={1}>
                              {payment.notes || "-"}
                            </Text>
                          </Flex>
                        </VStack>
                      </CardBody>
                      <CardFooter>
                        <Flex justify="end" gap={2} pt={4}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(payment)}
                          >
                            <Icon as={Edit} w="16px" h="16px" mr={1.5} />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            color="red.600"
                            borderColor="red.200"
                            _hover={{ bg: "red.50", color: "red.700" }}
                            onClick={() => onDelete(payment.id)}
                          >
                            <Icon as={Trash2} w="16px" h="16px" />
                          </Button>
                        </Flex>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </VStack>
        </Box>

        {/* Desktop View */}
        <Box display={{ base: "none", md: "block" }} overflowX="auto">
          <Table>
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Customer</Th>
                <Th>Amount</Th>
                <Th>Payment Type</Th>
                <Th>Notes</Th>
                <Th textAlign="right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sortedPayments.map((payment) => {
                const receivable = getReceivableById(payment.receivable_id);
                return (
                  <Tr
                    key={payment.id}
                    _hover={{ bg: "green.50" }}
                    transition="colors"
                  >
                    <Td>
                      {format(new Date(payment.payment_date), "MMM d, yyyy")}
                    </Td>
                    <Td fontWeight="medium">
                      {receivable?.customer_name || "Unknown Customer"}
                    </Td>
                    <Td fontWeight="semibold" color="green.600">
                      {(payment.payment_amount || 0).toLocaleString()} MMK
                    </Td>
                    <Td>
                      <Badge
                        variant="outline"
                        borderColor="green.200"
                        color="green.700"
                      >
                        {payment.payment_type}
                      </Badge>
                    </Td>
                    <Td color="gray.600" maxW="xs" noOfLines={1}>
                      {payment.notes || "-"}
                    </Td>
                    <Td textAlign="right">
                      <Flex justify="end" gap={1}>
                        <Button
                          variant="ghost"
                          size="sm"
                          color="orange.600"
                          _hover={{ bg: "orange.100" }}
                          onClick={() => onEdit(payment)}
                          title="Edit Payment"
                        >
                          <Icon as={Edit} w="16px" h="16px" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          color="red.600"
                          _hover={{ bg: "red.100" }}
                          onClick={() => onDelete(payment.id)}
                          title="Delete Payment"
                        >
                          <Icon as={Trash2} w="16px" h="16px" />
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </Card>
  );
}
