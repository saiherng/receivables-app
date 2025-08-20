import React, { useState, useEffect } from "react";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { X, Receipt, CreditCard, MapPin, Edit, Trash2, Plus, DollarSignIcon } from "lucide-react";
import { format } from "date-fns";
import PaymentForm from "../payments/PaymentForm";
import { apiService } from "../../lib/api";
import { getCityBadgeProps } from "../../lib/city-utils";

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
  onPaymentAdded?: () => void;
}

export default function CustomerDetail({
  customer,
  onClose,
  onEditPayment,
  onDeletePayment,
  onPaymentAdded,
}: CustomerDetailProps) {
  const { name, receivables, payments, totalReceivables, totalPaid, outstandingBalance, cities } = customer;
  const [selectedReceivable, setSelectedReceivable] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<any>(null);
  
  const { isOpen, onOpen, onClose: onModalClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  
  const toast = useToast();

  // Reset selected items when customer data changes
  useEffect(() => {
    setSelectedReceivable(null);
    setSelectedPayment(null);
    setPaymentToDelete(null);
  }, [customer]);

  const handleAddPayment = (receivable: any) => {
    setSelectedReceivable(receivable);
    onOpen();
  };

  const handleEditPayment = (payment: any) => {
    setSelectedPayment(payment);
    onEditOpen();
  };

  const handleDeletePaymentClick = (payment: any) => {
    setPaymentToDelete(payment);
    onDeleteOpen();
  };

  const handleConfirmDeletePayment = async () => {
    if (paymentToDelete) {
      try {
        // Use the API service to delete the payment
        await apiService.deletePayment(paymentToDelete.id);
        
        setPaymentToDelete(null);
        onDeleteClose();
        
        toast({
          title: 'Payment deleted successfully',
          description: 'Payment has been removed',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Refresh the customer data
        if (onPaymentAdded) {
          onPaymentAdded();
        }
      } catch (error: any) {
        toast({
          title: 'Error deleting payment',
          description: error.message || 'Failed to delete payment',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleCancelDeletePayment = () => {
    setPaymentToDelete(null);
    onDeleteClose();
  };

  const handlePaymentSubmit = async (paymentData: any) => {
    try {
      // Add the receivable_id to the payment data
      const paymentWithReceivable = {
        ...paymentData,
        receivable_id: selectedReceivable.id,
      };

      // Use the API service to create the payment
      await apiService.createPayment(paymentWithReceivable);
      
      toast({
        title: 'Payment added successfully',
        description: `Payment of ${paymentData.payment_amount.toLocaleString()} MMK has been recorded`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onModalClose();
      setSelectedReceivable(null);
      
      // Refresh the customer data
      if (onPaymentAdded) {
        onPaymentAdded();
      }
    } catch (error: any) {
      toast({
        title: 'Error adding payment',
        description: error.message || 'Failed to add payment',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditPaymentSubmit = async (paymentData: any) => {
    try {
      // Use the API service to update the payment
      await apiService.updatePayment(selectedPayment.id, paymentData);
      
      toast({
        title: 'Payment updated successfully',
        description: `Payment of ${paymentData.payment_amount.toLocaleString()} MMK has been updated`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onEditClose();
      setSelectedPayment(null);
      
      // Refresh the customer data
      if (onPaymentAdded) {
        onPaymentAdded();
      }
    } catch (error: any) {
      toast({
        title: 'Error updating payment',
        description: error.message || 'Failed to update payment',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
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
                    <Text fontSize="2xl" fontWeight="bold" color="blue.800">
                      {totalReceivables.toLocaleString()} MMK
                    </Text>
                  </Box>
                  <Box p={4} bg="green.50" borderRadius="lg" border="1px solid" borderColor="green.200">
                    <Text fontSize="sm" fontWeight="medium" color="green.700">
                      Total Paid
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color="green.800">
                      {totalPaid.toLocaleString()} MMK
                    </Text>
                  </Box>
                  <Box p={4} bg={outstandingBalance > 0 ? "orange.50" : "gray.50"} borderRadius="lg" border="1px solid" borderColor={outstandingBalance > 0 ? "orange.200" : "gray.200"}>
                    <Text fontSize="sm" fontWeight="medium" color={outstandingBalance > 0 ? "orange.700" : "gray.700"}>
                      Outstanding Balance
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color={outstandingBalance > 0 ? "orange.800" : "gray.800"}>
                      {outstandingBalance.toLocaleString()} MMK
                    </Text>
                  </Box>
                </Grid>

                {/* Receivables Section */}
                <Box mb={8}>
                  <Flex align="center" justify="space-between" mb={4}>
                    <Flex align="center" gap={2}>
                      <Icon as={Receipt} w="20px" h="20px" color="blue.600" />
                      <Text fontSize="lg" fontWeight="semibold">Receivables ({receivables.length})</Text>
                    </Flex>
                  </Flex>
                  <Box overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="lg">
                    <Table size="sm">
                      <Thead bg="gray.50">
                        <Tr>
                          <Th borderBottom="1px solid" borderColor="gray.200">Date</Th>
                          <Th borderBottom="1px solid" borderColor="gray.200">Amount</Th>
                          <Th borderBottom="1px solid" borderColor="gray.200">City</Th>
                          <Th borderBottom="1px solid" borderColor="gray.200">Description</Th>
                          <Th textAlign="right" borderBottom="1px solid" borderColor="gray.200">Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {receivables.map((r, index) => (
                          <Tr key={r.id} _hover={{ bg: "gray.50" }}>
                            <Td borderBottom={index === receivables.length - 1 ? "none" : "1px solid"} borderColor="gray.200" verticalAlign="middle">
                              {format(new Date(r.date), "MMM d, yyyy")}
                            </Td>
                            <Td fontWeight="medium" color="blue.600" borderBottom={index === receivables.length - 1 ? "none" : "1px solid"} borderColor="gray.200" verticalAlign="middle">
                              {r.amount.toLocaleString()} MMK
                            </Td>
                            <Td borderBottom={index === receivables.length - 1 ? "none" : "1px solid"} borderColor="gray.200" verticalAlign="middle">
                              <Badge {...getCityBadgeProps(r.city)}>
                                {r.city}
                              </Badge>
                            </Td>
                            <Td color="gray.600" maxW="xs" borderBottom={index === receivables.length - 1 ? "none" : "1px solid"} borderColor="gray.200" verticalAlign="middle">
                              <Text noOfLines={1} title={r.description || "-"}>
                                {r.description || "-"}
                              </Text>
                            </Td>
                            <Td textAlign="right" borderBottom={index === receivables.length - 1 ? "none" : "1px solid"} borderColor="gray.200" verticalAlign="middle">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAddPayment(r)}
                                color="green.600"
                                _hover={{ bg: "green.100" }}
                                title="Add Payment"
                              >
                                <Icon as={DollarSignIcon} w="16px" h="16px" />
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </Box>

                {/* Payments Section */}
                <Box>
                  <Flex align="center" gap={2} mb={4}>
                    <Icon as={CreditCard} w="20px" h="20px" color="green.600" />
                    <Text fontSize="lg" fontWeight="semibold">Payments ({payments.length})</Text>
                  </Flex>
                  <Box overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="lg">
                    <Table size="sm">
                      <Thead bg="gray.50">
                        <Tr>
                          <Th borderBottom="1px solid" borderColor="gray.200">Date</Th>
                          <Th borderBottom="1px solid" borderColor="gray.200">Amount</Th>
                          <Th borderBottom="1px solid" borderColor="gray.200">Type</Th>
                          <Th borderBottom="1px solid" borderColor="gray.200">Notes</Th>
                          <Th textAlign="right" borderBottom="1px solid" borderColor="gray.200">Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {payments.map((p, index) => (
                          <Tr key={p.id} _hover={{ bg: "gray.50" }}>
                            <Td borderBottom={index === payments.length - 1 ? "none" : "1px solid"} borderColor="gray.200" verticalAlign="middle">
                              {format(new Date(p.payment_date), "MMM d, yyyy")}
                            </Td>
                            <Td fontWeight="medium" color="green.700" borderBottom={index === payments.length - 1 ? "none" : "1px solid"} borderColor="gray.200" verticalAlign="middle">
                              {p.payment_amount.toLocaleString()} MMK
                            </Td>
                            <Td borderBottom={index === payments.length - 1 ? "none" : "1px solid"} borderColor="gray.200" verticalAlign="middle">
                              {p.payment_type}
                            </Td>
                            <Td borderBottom={index === payments.length - 1 ? "none" : "1px solid"} borderColor="gray.200" verticalAlign="middle">
                              <Text noOfLines={1} title={p.notes || "-"}>
                                {p.notes || "-"}
                              </Text>
                            </Td>
                            <Td textAlign="right" borderBottom={index === payments.length - 1 ? "none" : "1px solid"} borderColor="gray.200" verticalAlign="middle">
                              <Flex justify="end" gap={1}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditPayment(p)}
                                  color="orange.600"
                                  _hover={{ bg: "orange.100" }}
                                  title="Edit Payment"
                                >
                                  <Icon as={Edit} w="16px" h="16px" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeletePaymentClick(p)}
                                  color="red.600"
                                  _hover={{ bg: "red.100" }}
                                  title="Delete Payment"
                                >
                                  <Icon as={Trash2} w="16px" h="16px" />
                                </Button>
                              </Flex>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </Box>
              </CardBody>
            </Box>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal isOpen={isOpen} onClose={onModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Add Payment for {selectedReceivable?.customer_name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedReceivable && (
              <PaymentForm
                receivables={[selectedReceivable]}
                receivableToPay={selectedReceivable}
                existingPayments={payments}
                onSubmit={handlePaymentSubmit}
                onCancel={onModalClose}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Edit Payment Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Edit Payment
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedPayment && (
              <PaymentForm
                receivables={receivables}
                receivableToPay={receivables.find(r => r.id === selectedPayment.receivable_id)}
                existingPayments={payments}
                paymentToEdit={selectedPayment}
                onSubmit={handleEditPaymentSubmit}
                onCancel={onEditClose}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Payment Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={React.useRef<HTMLButtonElement>(null)}
        onClose={handleCancelDeletePayment}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Payment
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete the payment of{" "}
              <Text as="span" fontWeight="bold" color="green.600">
                {(paymentToDelete?.payment_amount || 0).toLocaleString()} MMK
              </Text>
              ? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={handleCancelDeletePayment}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDeletePayment} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
