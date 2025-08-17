import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardBody,
  CardHeader,
  Text,
  Button,
  Input,
  Textarea,
  Select,
  Flex,
  Box,
  VStack,
  HStack,
  Icon,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Save, Edit, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { Receivable, Payment } from "@/entities/all";

const PREDEFINED_PAYMENT_TYPES = [
  "Cash",
  "KPay",
  "Banking",
  "Wave Money",
  "CB Pay",
  "Other",
];

interface PaymentFormProps {
  receivables: any[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  receivableToPay: any;
  existingPayments?: any[];
  paymentToEdit?: any;
}

export default function PaymentForm({
  receivables,
  onSubmit,
  onCancel,
  receivableToPay,
  existingPayments = [],
  paymentToEdit,
}: PaymentFormProps) {
  const [formData, setFormData] = useState({
    receivable_id: receivableToPay ? receivableToPay.id : "",
    payment_date: format(new Date(), "yyyy-MM-dd"),
    payment_amount: "",
    payment_type: "Banking",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCustomPaymentTypeInput, setShowCustomPaymentTypeInput] =
    useState(false);
  const [customPaymentType, setCustomPaymentType] = useState("");
  const [allAvailablePaymentTypes, setAllAvailablePaymentTypes] = useState<string[]>(PREDEFINED_PAYMENT_TYPES);

  const isEditing = !!paymentToEdit;

  useEffect(() => {
    const existingTypes = [
      ...new Set(existingPayments.map((p) => p.payment_type).filter(Boolean)),
    ];
    const combinedTypes = [
      ...new Set([...PREDEFINED_PAYMENT_TYPES, ...existingTypes]),
    ].sort();
    setAllAvailablePaymentTypes(combinedTypes);
  }, [existingPayments]);

  useEffect(() => {
    if (isEditing) {
      setFormData({
        receivable_id: paymentToEdit.receivable_id || "",
        payment_date: paymentToEdit.payment_date
          ? format(new Date(paymentToEdit.payment_date), "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd"),
        payment_amount: paymentToEdit.payment_amount || "",
        payment_type: paymentToEdit.payment_type || "Banking",
        notes: paymentToEdit.notes || "",
      });
    } else {
      setFormData({
        receivable_id: receivableToPay ? receivableToPay.id : "",
        payment_date: format(new Date(), "yyyy-MM-dd"),
        payment_amount: "",
        payment_type: "Banking",
        notes: "",
      });
    }
  }, [paymentToEdit, receivableToPay, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    const finalPaymentType = showCustomPaymentTypeInput
      ? customPaymentType.trim()
      : formData.payment_type;



    // Validate all required fields
    if (!formData.receivable_id) {
      newErrors.receivable_id = "Receivable is required.";
    }

    if (!formData.payment_date) {
      newErrors.payment_date = "Payment date is required.";
    }

    if (!formData.payment_amount || parseFloat(formData.payment_amount) <= 0) {
      newErrors.payment_amount = "Payment amount must be a positive number.";
    }

    if (!finalPaymentType || finalPaymentType.trim() === "") {
      newErrors.payment_type = "Payment type is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    
    const paymentData = {
      ...formData,
      payment_type: finalPaymentType,
      payment_amount: parseFloat(formData.payment_amount),
      ...(isEditing && { id: paymentToEdit.id }),
    };
    
    onSubmit(paymentData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePaymentTypeSelect = (value: string) => {
    if (value === "add_new_payment_type") {
      setShowCustomPaymentTypeInput(true);
      setCustomPaymentType("");
    } else {
      setShowCustomPaymentTypeInput(false);
      handleChange("payment_type", value);
    }
  };

  const handleAddCustomPaymentType = () => {
    if (customPaymentType.trim()) {
      const newType = customPaymentType.trim();
      handleChange("payment_type", newType);

      if (!allAvailablePaymentTypes.includes(newType)) {
        setAllAvailablePaymentTypes((prev) => [...prev, newType].sort());
      }

      setShowCustomPaymentTypeInput(false);
      setCustomPaymentType("");
    }
  };

  const selectedReceivable = isEditing
    ? receivables &&
      receivables.find((r) => r.id === paymentToEdit.receivable_id)
    : receivableToPay ||
      (receivables && receivables.find((r) => r.id === formData.receivable_id));

  const calculateRemainingAmount = (receivable: any) => {
    if (!receivable) return 0;

    const relevantPayments = isEditing
      ? existingPayments.filter(
          (p) => p.receivable_id === receivable.id && p.id !== paymentToEdit.id
        )
      : existingPayments.filter((p) => p.receivable_id === receivable.id);

    const paidAmount = relevantPayments.reduce(
      (sum, p) => sum + (p.payment_amount || 0),
      0
    );
    return Math.max(0, (receivable.amount || 0) - paidAmount);
  };

  const remainingAmount = calculateRemainingAmount(selectedReceivable);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ marginBottom: "2rem" }}
    >
      <Card bg="white" border="1px solid" borderColor="green.200" borderRadius="lg" boxShadow="xl">
        <CardHeader bgGradient="linear(to-r, green.500, green.600)" color="white" borderTopRadius="lg">
          <Flex align="center" justify="space-between">
            <Text fontSize="lg" fontWeight="semibold">
              {isEditing ? "Edit Payment" : "Record Payment"}
            </Text>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
            >
              <Icon as={X} w="20px" h="20px" />
            </Button>
          </Flex>
        </CardHeader>
        <CardBody p={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                <VStack spacing={2} align="stretch">
                  <Text fontSize="sm" fontWeight="medium">Select Receivable</Text>
                  <Select
                    value={formData.receivable_id}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange("receivable_id", e.target.value)}
                    required
                    isDisabled={isEditing || !!receivableToPay}
                    borderColor={errors.receivable_id ? "red.500" : undefined}
                    _focus={{ borderColor: errors.receivable_id ? "red.500" : undefined }}
                  >
                    <option value="">Select a receivable...</option>
                    {isEditing && selectedReceivable ? (
                      <option value={selectedReceivable.id}>
                        {selectedReceivable.customer_name} -{" "}
                        {(selectedReceivable.amount || 0).toLocaleString()} MMK
                        (
                        {format(
                          new Date(selectedReceivable.date),
                          "MMM d, yyyy"
                        )}
                        )
                      </option>
                    ) : receivableToPay ? (
                      <option value={receivableToPay.id}>
                        {receivableToPay.customer_name} -{" "}
                        {(receivableToPay.amount || 0).toLocaleString()} MMK (
                        {format(new Date(receivableToPay.date), "MMM d, yyyy")})
                      </option>
                    ) : (
                      receivables &&
                      receivables.map((receivable) => (
                        <option key={receivable.id} value={receivable.id}>
                          {receivable.customer_name} -{" "}
                          {(receivable.amount || 0).toLocaleString()} MMK (
                          {format(new Date(receivable.date), "MMM d, yyyy")})
                        </option>
                      ))
                    )}
                  </Select>
                  {errors.receivable_id && (
                    <Text fontSize="sm" color="red.600" mt={1}>
                      {errors.receivable_id}
                    </Text>
                  )}
                </VStack>
                <VStack spacing={2} align="stretch">
                  <Text fontSize="sm" fontWeight="medium">Payment Date</Text>
                  <Input
                    id="payment_date"
                    type="date"
                    value={formData.payment_date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("payment_date", e.target.value)}
                    required
                    borderColor={errors.payment_date ? "red.500" : undefined}
                    _focus={{ borderColor: errors.payment_date ? "red.500" : undefined }}
                  />
                  {errors.payment_date && (
                    <Text fontSize="sm" color="red.600" mt={1}>
                      {errors.payment_date}
                    </Text>
                  )}
                </VStack>
                <VStack spacing={2} align="stretch">
                  <Text fontSize="sm" fontWeight="medium">Payment Amount (MMK)</Text>
                  <Input
                    id="payment_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.payment_amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange("payment_amount", e.target.value)
                    }
                    placeholder="0.00"
                    required
                    borderColor={errors.payment_amount ? "red.500" : undefined}
                    _focus={{ borderColor: errors.payment_amount ? "red.500" : undefined }}
                  />
                  {errors.payment_amount && (
                    <Text fontSize="sm" color="red.600" mt={1}>
                      {errors.payment_amount}
                    </Text>
                  )}
                  {selectedReceivable && (
                    <VStack spacing={1} align="stretch" fontSize="sm" mt={2}>
                      <Text color="gray.600">
                        Total receivable:{" "}
                        {(selectedReceivable.amount || 0).toLocaleString()} MMK
                      </Text>
                      <Text color="orange.600" fontWeight="medium">
                        Remaining amount: {remainingAmount.toLocaleString()} MMK
                      </Text>
                    </VStack>
                  )}
                </VStack>
                <VStack spacing={2} align="stretch">
                  <Text fontSize="sm" fontWeight="medium">Payment Type</Text>
                  {showCustomPaymentTypeInput ? (
                    <HStack spacing={2}>
                      <Input
                        placeholder="Enter new payment type..."
                        value={customPaymentType}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomPaymentType(e.target.value)}
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustomPaymentType();
                          }
                        }}
                        flex={1}
                        autoFocus
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddCustomPaymentType}
                        isDisabled={!customPaymentType.trim()}
                      >
                        <Icon as={Plus} w="16px" h="16px" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowCustomPaymentTypeInput(false);
                          setCustomPaymentType("");
                        }}
                      >
                        <Icon as={X} w="16px" h="16px" />
                      </Button>
                    </HStack>
                  ) : (
                    <Select
                      value={formData.payment_type}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handlePaymentTypeSelect(e.target.value)}
                      required
                      borderColor={errors.payment_type ? "red.500" : undefined}
                      _focus={{ borderColor: errors.payment_type ? "red.500" : undefined }}
                    >
                      {allAvailablePaymentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                      <option
                        value="add_new_payment_type"
                        style={{ color: "#2563eb", fontWeight: "500" }}
                      >
                        Add new payment type...
                      </option>
                    </Select>
                  )}
                  {errors.payment_type && (
                    <Text fontSize="sm" color="red.600" mt={1}>
                      {errors.payment_type}
                    </Text>
                  )}
                </VStack>
              </Grid>
              <VStack spacing={2} align="stretch">
                <Text fontSize="sm" fontWeight="medium">Notes (Optional)</Text>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("notes", e.target.value)}
                  placeholder="Payment notes..."
                  rows={3}
                />
              </VStack>
              <Flex justify="end" gap={3}>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  bgGradient="linear(to-r, green.500, green.600)"
                  _hover={{ bgGradient: "linear(to-r, green.600, green.700)" }}
                  color="white"
                >
                  {isEditing ? (
                    <Icon as={Edit} w="16px" h="16px" mr={2} />
                  ) : (
                    <Icon as={Save} w="16px" h="16px" mr={2} />
                  )}
                  {isEditing ? "Update Payment" : "Record Payment"}
                </Button>
              </Flex>
            </VStack>
          </form>
        </CardBody>
      </Card>
    </motion.div>
  );
}
