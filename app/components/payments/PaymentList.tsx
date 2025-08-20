import React, { useState } from "react";
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import {
  CreditCard,
  Edit,
  Trash2,
  Calendar,
  User,
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paymentToDelete, setPaymentToDelete] = useState<any>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const handleDeleteClick = (payment: any) => {
    setPaymentToDelete(payment);
    onOpen();
  };

  const handleConfirmDelete = () => {
    if (paymentToDelete) {
      onDelete(paymentToDelete.id);
      setPaymentToDelete(null);
      onClose();
    }
  };

  const handleCancelDelete = () => {
    setPaymentToDelete(null);
    onClose();
  };

  if (isLoading) {
    return (
      <Card bg="white" border="1px solid" borderColor="green.200" borderRadius="lg">
        <CardHeader>
          <Flex align="center" gap={2}>
            <Icon as={CreditCard} w="20px" h="20px" />
            <Text fontSize="lg" fontWeight="semibold">Payments List</Text>
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

  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
  );

  return (
    <>
      <Card bg="white" border="1px solid" borderColor="green.200" borderRadius="lg">
        <CardHeader>
          <Flex align="center" gap={2}>
            <Icon as={CreditCard} w="20px" h="20px" />
            <Text fontSize="lg" fontWeight="semibold">Payments List</Text>
          </Flex>
        </CardHeader>
        <CardBody>
          <Box overflowX="auto">
            <Table variant="simple">
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
                <AnimatePresence>
                  {sortedPayments.map((payment) => {
                    const receivable = getReceivableById(payment.receivable_id);
                    return (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        style={{ cursor: 'pointer' }}
                        whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
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
                              onClick={() => handleDeleteClick(payment)}
                              title="Delete Payment"
                            >
                              <Icon as={Trash2} w="16px" h="16px" />
                            </Button>
                          </Flex>
                        </Td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCancelDelete}
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
              {" "}for{" "}
              <Text as="span" fontWeight="bold">
                {paymentToDelete ? getReceivableById(paymentToDelete.receivable_id)?.customer_name : ""}
              </Text>
              ? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
