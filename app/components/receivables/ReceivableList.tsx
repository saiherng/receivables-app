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
  Icon,
  Skeleton,
} from "@chakra-ui/react";
import {
  Edit,
  Trash2,
  Receipt,
  DollarSign,
  Calendar,
  Landmark,
  Coins,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

interface ReceivableListProps {
  receivables: any[];
  getReceivablePayments: (receivableId: string) => any[];
  onEdit: (receivable: any) => void;
  onDelete: (receivableId: string) => void;
  onRecordPayment: (receivable: any) => void;
  isLoading: boolean;
}

export default function ReceivableList({
  receivables,
  getReceivablePayments,
  onEdit,
  onDelete,
  onRecordPayment,
  isLoading,
}: ReceivableListProps) {
  const calculatePaidAmount = (receivableId: string) => {
    const payments = getReceivablePayments(receivableId);
    return payments.reduce(
      (sum: number, payment: any) => sum + (payment.payment_amount || 0),
      0
    );
  };

  const StatusBadge = ({ receivable, paidAmount }: { receivable: any; paidAmount: number }) => {
    const remainingAmount = (receivable.amount || 0) - paidAmount;
    const isFullyPaid = remainingAmount <= 0;
    const isPartiallyPaid = paidAmount > 0 && remainingAmount > 0;
    const statusText = isFullyPaid
      ? "Paid"
      : isPartiallyPaid
      ? "Partial"
      : "Unpaid";
    
    const statusColor = isFullyPaid
      ? "green"
      : isPartiallyPaid
      ? "orange"
      : "red";

    return (
      <Badge variant="outline" colorScheme={statusColor}>
        {statusText}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card bg="white" border="1px solid" borderColor="orange.200" borderRadius="lg">
        <CardHeader>
          <Flex align="center" gap={2}>
            <Icon as={Receipt} w="20px" h="20px" />
            <Text fontSize="lg" fontWeight="semibold">Receivables List</Text>
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

  return (
    <Card bg="white" border="1px solid" borderColor="orange.200" borderRadius="lg">
      <CardHeader>
        <Flex align="center" gap={2}>
          <Icon as={Receipt} w="20px" h="20px" />
          <Text fontSize="lg" fontWeight="semibold">Receivables List ({receivables.length})</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        {/* Mobile View */}
        <Box display={{ base: "block", md: "none" }}>
          <VStack spacing={4} align="stretch">
            <AnimatePresence>
              {receivables.map((receivable: any) => {
                const paidAmount = calculatePaidAmount(receivable.id);
                return (
                  <motion.div
                    key={receivable.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card border="1px solid" borderColor="orange.200" borderRadius="lg">
                      <CardHeader pb={4}>
                        <Flex justify="space-between" align="start">
                          <Box>
                            <Text fontSize="lg" fontWeight="bold" color="gray.900">
                              {receivable.customer_name}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {format(new Date(receivable.date), "MMM d, yyyy")}
                            </Text>
                          </Box>
                          <StatusBadge
                            receivable={receivable}
                            paidAmount={paidAmount}
                          />
                        </Flex>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={3} align="stretch" fontSize="sm">
                          <Flex justify="space-between" align="center">
                            <Flex align="center" gap={2} color="gray.600">
                              <Icon as={Landmark} w="16px" h="16px" />
                              Amount
                            </Flex>
                            <Text fontWeight="semibold">
                              {(receivable.amount || 0).toLocaleString()} MMK
                            </Text>
                          </Flex>
                          <Flex justify="space-between" align="center">
                            <Flex align="center" gap={2} color="gray.600">
                              <Icon as={Coins} w="16px" h="16px" color="green.600" />
                              Paid
                            </Flex>
                            <Text fontWeight="medium" color="green.600">
                              {paidAmount.toLocaleString()} MMK
                            </Text>
                          </Flex>
                          <Flex justify="space-between" align="center">
                            <Flex align="center" gap={2} color="gray.600">
                              <Icon as={FileText} w="16px" h="16px" />
                              Notes
                            </Flex>
                            <Text color="gray.800" maxW="60%" noOfLines={1}>
                              {receivable.description || "-"}
                            </Text>
                          </Flex>
                        </VStack>
                      </CardBody>
                      <CardFooter>
                        <Flex justify="end" gap={2} pt={4}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRecordPayment(receivable)}
                          >
                            <Icon as={DollarSign} w="16px" h="16px" mr={1.5} />
                            Pay
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(receivable)}
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
                            onClick={() => onDelete(receivable.id)}
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
                <Th>City</Th>
                <Th>Paid</Th>
                <Th>Status</Th>
                <Th>Notes</Th>
                <Th textAlign="right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              <AnimatePresence>
                {receivables.map((receivable: any) => {
                  const paidAmount = calculatePaidAmount(receivable.id);
                  return (
                    <Tr
                      key={receivable.id}
                      _hover={{ bg: "orange.50" }}
                      transition="colors"
                    >
                      <Td>
                        {format(new Date(receivable.date), "MMM d, yyyy")}
                      </Td>
                      <Td fontWeight="medium">
                        {receivable.customer_name}
                      </Td>
                      <Td fontWeight="semibold">
                        {(receivable.amount || 0).toLocaleString()} MMK
                      </Td>
                      <Td>
                        <Badge
                          variant="outline"
                          borderColor="blue.200"
                          color="blue.700"
                        >
                          {receivable.city}
                        </Badge>
                      </Td>
                      <Td fontWeight="medium" color="green.600">
                        {paidAmount.toLocaleString()} MMK
                      </Td>
                      <Td>
                        <StatusBadge
                          receivable={receivable}
                          paidAmount={paidAmount}
                        />
                      </Td>
                      <Td color="gray.600" maxW="xs" noOfLines={1}>
                        {receivable.description || "-"}
                      </Td>
                      <Td textAlign="right">
                        <Flex justify="end" gap={1}>
                          <Button
                            variant="ghost"
                            size="sm"
                            color="green.600"
                            _hover={{ bg: "green.100" }}
                            onClick={() => onRecordPayment(receivable)}
                            title="Record Payment"
                          >
                            <Icon as={DollarSign} w="16px" h="16px" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            color="orange.600"
                            _hover={{ bg: "orange.100" }}
                            onClick={() => onEdit(receivable)}
                            title="Edit Receivable"
                          >
                            <Icon as={Edit} w="16px" h="16px" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            color="red.600"
                            _hover={{ bg: "red.100" }}
                            onClick={() => onDelete(receivable.id)}
                            title="Delete Receivable"
                          >
                            <Icon as={Trash2} w="16px" h="16px" />
                          </Button>
                                                 </Flex>
                       </Td>
                     </Tr>
                   );
                 })}
              </AnimatePresence>
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </Card>
  );
}
