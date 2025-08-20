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
import { getCityBadgeProps } from "../../lib/city-utils";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [receivableToDelete, setReceivableToDelete] = useState<any>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const calculatePaidAmount = (receivableId: string) => {
    const payments = getReceivablePayments(receivableId);
    return payments.reduce(
      (sum: number, payment: any) => sum + (payment.payment_amount || 0),
      0
    );
  };

  const handleDeleteClick = (receivable: any) => {
    setReceivableToDelete(receivable);
    onOpen();
  };

  const handleConfirmDelete = () => {
    if (receivableToDelete) {
      onDelete(receivableToDelete.id);
      setReceivableToDelete(null);
      onClose();
    }
  };

  const handleCancelDelete = () => {
    setReceivableToDelete(null);
    onClose();
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
    <>
      <Card bg="white" border="1px solid" borderColor="orange.200" borderRadius="lg">
        <CardHeader>
          <Flex align="center" gap={2}>
            <Icon as={Receipt} w="20px" h="20px" />
            <Text fontSize="lg" fontWeight="semibold">Receivables List</Text>
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
                  <Th>City</Th>
                  <Th>Status</Th>
                  <Th>Description</Th>
                  <Th textAlign="right">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                <AnimatePresence>
                  {receivables.map((receivable: any) => {
                    const paidAmount = calculatePaidAmount(receivable.id);
                    return (
                      <motion.tr
                        key={receivable.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        style={{ cursor: 'pointer' }}
                        whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                      >
                        <Td>
                          {format(new Date(receivable.date), "MMM d, yyyy")}
                        </Td>
                        <Td fontWeight="medium">
                          {receivable.customer_name}
                        </Td>
                        <Td fontWeight="semibold" color="blue.600">
                          {(receivable.amount || 0).toLocaleString()} MMK
                        </Td>
                        <Td>
                          <Badge {...getCityBadgeProps(receivable.city)}>
                            {receivable.city}
                          </Badge>
                        </Td>
                        <Td>
                          <StatusBadge receivable={receivable} paidAmount={paidAmount} />
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
                              onClick={() => handleDeleteClick(receivable)}
                              title="Delete Receivable"
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
              Delete Receivable
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete the receivable for{" "}
              <Text as="span" fontWeight="bold">
                {receivableToDelete?.customer_name}
              </Text>
              ? This action cannot be undone and will also delete all associated payments.
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
