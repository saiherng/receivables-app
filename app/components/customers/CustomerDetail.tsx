import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardBody,
  CardHeader,
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
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { X, Receipt, CreditCard, MapPin, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface CustomerDetailProps {
  customer: {
    name: string;
    receivables: any[];
    payments: any[];
    totalReceivables: number;
    totalPaid: number;
    outstandingBalance: number;
    cities: string[];
  };
  onClose: () => void;
  onEditPayment: (payment: any) => void;
  onDeletePayment?: (paymentId: string) => void;
}

export default function CustomerDetail({
  customer,
  onClose,
  onEditPayment,
  onDeletePayment,
}: CustomerDetailProps) {
  const {
    name,
    receivables,
    payments,
    totalReceivables,
    totalPaid,
    outstandingBalance,
    cities,
  } = customer;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{ width: "100%", maxWidth: "56rem" }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <Card maxH="90vh" bg="white" border="1px solid" borderColor="orange.200" boxShadow="2xl" display="flex" flexDirection="column">
          <CardHeader bgGradient="linear(to-r, orange.500, orange.600)" color="white" borderTopRadius="lg" position="sticky" top={0} zIndex={10}>
            <Flex align="center" justify="space-between">
              <Text fontSize="lg" fontWeight="semibold">{name}</Text>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
              >
                <Icon as={X} w="20px" h="20px" />
              </Button>
            </Flex>
            {cities && cities.length > 0 && (
              <Flex align="center" gap={2} mt={2} color="whiteAlpha.900">
                <Icon as={MapPin} w="16px" h="16px" />
                <Text fontSize="sm" fontWeight="medium">{cities.join(", ")}</Text>
              </Flex>
            )}
          </CardHeader>
          <Box overflowY="auto">
            <CardBody p={{ base: 4, md: 6 }}>
              {/* Summary Section */}
              <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mb={8}>
                <Box p={4} bg="blue.50" borderRadius="lg" border="1px solid" borderColor="blue.200">
                  <Text fontSize="sm" fontWeight="medium" color="blue.700">
                    Total Receivables
                  </Text>
                  <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="blue.900">
                    {totalReceivables.toLocaleString()} MMK
                  </Text>
                </Box>
                <Box p={4} bg="green.50" borderRadius="lg" border="1px solid" borderColor="green.200">
                  <Text fontSize="sm" fontWeight="medium" color="green.700">
                    Total Paid
                  </Text>
                  <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="green.900">
                    {totalPaid.toLocaleString()} MMK
                  </Text>
                </Box>
                <Box p={4} bg="orange.50" borderRadius="lg" border="1px solid" borderColor="orange.200">
                  <Text fontSize="sm" fontWeight="medium" color="orange.700">
                    Outstanding
                  </Text>
                  <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="orange.900">
                    {outstandingBalance.toLocaleString()} MMK
                  </Text>
                </Box>
              </Grid>

              {/* Receivables List */}
              <Box mb={8}>
                <Flex align="center" gap={2} mb={4}>
                  <Icon as={Receipt} w="20px" h="20px" color="orange.600" />
                  <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                    Receivables
                  </Text>
                </Flex>
                <Box border="1px solid" borderColor="gray.200" borderRadius="lg" overflow="hidden">
                  <Box overflowX="auto">
                    <Table>
                      <Thead bg="gray.50">
                        <Tr>
                          <Th>Date</Th>
                          <Th>Amount</Th>
                          <Th>City</Th>
                          <Th>Status</Th>
                          <Th textAlign="right">Balance Due</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {receivables.map((r) => {
                          const paidForThis = payments
                            .filter((p) => p.receivable_id === r.id)
                            .reduce((sum, p) => sum + p.payment_amount, 0);
                          const balance = r.amount - paidForThis;
                          const isFullyPaid = balance <= 0;
                          const isPartiallyPaid =
                            paidForThis > 0 && balance > 0;
                          return (
                            <Tr key={r.id}>
                              <Td>
                                {format(new Date(r.date), "MMM d, yy")}
                              </Td>
                              <Td fontWeight="medium">
                                {r.amount.toLocaleString()}
                              </Td>
                              <Td>{r.city}</Td>
                              <Td>
                                <Badge
                                  colorScheme={
                                    isFullyPaid
                                      ? "green"
                                      : isPartiallyPaid
                                      ? "orange"
                                      : "red"
                                  }
                                >
                                  {isFullyPaid
                                    ? "Paid"
                                    : isPartiallyPaid
                                    ? "Partial"
                                    : "Unpaid"}
                                </Badge>
                              </Td>
                              <Td textAlign="right" fontWeight="semibold" color="orange.700">
                                {balance.toLocaleString()}
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </Box>
                </Box>
              </Box>

              {/* Payments List */}
              <Box>
                <Flex align="center" gap={2} mb={4}>
                  <Icon as={CreditCard} w="20px" h="20px" color="green.600" />
                  <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                    Payment History
                  </Text>
                </Flex>
                <Box border="1px solid" borderColor="gray.200" borderRadius="lg" overflow="hidden">
                  <Box overflowX="auto">
                    <Table>
                      <Thead bg="gray.50">
                        <Tr>
                          <Th>Date</Th>
                          <Th>Amount</Th>
                          <Th>Type</Th>
                          <Th>Notes</Th>
                          <Th textAlign="right">Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {payments.map((p) => (
                          <Tr key={p.id}>
                            <Td>
                              {format(new Date(p.payment_date), "MMM d, yy")}
                            </Td>
                            <Td fontWeight="medium" color="green.700">
                              {p.payment_amount.toLocaleString()}
                            </Td>
                            <Td>{p.payment_type}</Td>
                            <Td>{p.notes || "-"}</Td>
                            <Td textAlign="right">
                              <Flex justify="end" gap={1}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onEditPayment(p)}
                                  color="orange.600"
                                  _hover={{ bg: "orange.100" }}
                                  title="Edit Payment"
                                >
                                  <Icon as={Edit} w="16px" h="16px" />
                                </Button>
                                {onDeletePayment && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDeletePayment(p.id)}
                                    color="red.600"
                                    _hover={{ bg: "red.100" }}
                                    title="Delete Payment"
                                  >
                                    <Icon as={Trash2} w="16px" h="16px" />
                                  </Button>
                                )}
                              </Flex>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Box>
        </Card>
      </div>
    </div>
  );
}
