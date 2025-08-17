'use client';
import React, { useState, useEffect } from "react";
import { Button, Box, Text, Flex, Container, useToast } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import PaymentForm from "../components/payments/PaymentForm";
import PaymentList from "../components/payments/PaymentList";
import PaymentFilters from "../components/payments/PaymentFilters";
import { Payment, Receivable } from "../lib/supabase";
import { apiService } from "../lib/api";

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [filters, setFilters] = useState({
    receivable: "all",
    customer: "",
    paymentType: "all",
    dateFrom: "",
    dateTo: "",
  });

  const toast = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [paymentsResponse, receivablesResponse] = await Promise.all([
        apiService.getPayments(),
        apiService.getReceivables(),
      ]);
      
      setPayments(paymentsResponse.data || []);
      setReceivables(receivablesResponse.data || []);
    } catch (error: any) {
      console.error("Error loading payments data:", error);
      toast({
        title: "Error loading data",
        description: error.message || "Failed to load payments and receivables",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  const handleSubmit = async (paymentData: any) => {
    try {
      if (editingPayment) {
        await apiService.updatePayment(editingPayment.id, paymentData);
        
        toast({
          title: "Payment updated",
          description: "Payment has been updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await apiService.createPayment(paymentData);
        
        toast({
          title: "Payment created",
          description: "New payment has been created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      
      setShowForm(false);
      setEditingPayment(null);
      loadData();
    } catch (error: any) {
      console.error("Error saving payment:", error);
      toast({
        title: "Error saving payment",
        description: error.message || "Failed to save payment",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleDelete = async (paymentId: string) => {
    try {
      await apiService.deletePayment(paymentId);
      
      loadData();
      toast({
        title: "Payment deleted",
        description: "Payment has been deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error("Error deleting payment:", error);
      toast({
        title: "Error deleting payment",
        description: error.message || "Failed to delete payment",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getReceivableById = (receivableId: string) => {
    return receivables.find((r) => r.id === receivableId);
  };

  // Get unique payment types from existing payments and predefined types
  const PREDEFINED_PAYMENT_TYPES = [
    "Cash",
    "KPay", 
    "Banking",
    "Wave Money",
    "CB Pay",
    "Other",
  ];
  
  const existingPaymentTypes = [...new Set(payments.map(p => p.payment_type).filter(Boolean))];
  const availablePaymentTypes = [...new Set([...PREDEFINED_PAYMENT_TYPES, ...existingPaymentTypes])].sort();

  const filteredPayments = payments.filter((payment) => {
    const receivable = getReceivableById(payment.receivable_id);
    const receivableMatch =
      filters.receivable === "all" || payment.receivable_id === filters.receivable;
    const customerMatch =
      !filters.customer || (receivable && receivable.customer_name?.toLowerCase().includes(filters.customer.toLowerCase()));
    const paymentTypeMatch =
      filters.paymentType === "all" || payment.payment_type === filters.paymentType;
    const dateFromMatch =
      !filters.dateFrom || payment.payment_date >= filters.dateFrom;
    const dateToMatch = !filters.dateTo || payment.payment_date <= filters.dateTo;

    return (
      receivableMatch && customerMatch && paymentTypeMatch && dateFromMatch && dateToMatch
    );
  });

  const handleClearFilters = () => {
    setFilters({
      receivable: "all",
      customer: "",
      paymentType: "all",
      dateFrom: "",
      dateTo: "",
    });
  };

  return (
    <Box p={6}>
      <Container maxW="7xl">
        <Flex 
          direction={{ base: "column", md: "row" }} 
          justify="space-between" 
          align={{ base: "start", md: "center" }} 
          mb={8} 
          gap={4}
        >
          <Box>
            <Text fontSize="3xl" fontWeight="bold" color="gray.900">Payments</Text>
            <Text color="gray.600" mt={1}>
              Track and manage payment records
            </Text>
          </Box>
          <Button
            onClick={() => setShowForm(!showForm)}
            bgGradient="linear(to-r, green.500, green.600)" 
            _hover={{ bgGradient: "linear(to-r, green.600, green.700)" }} 
            color="white" 
            boxShadow="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Payment
          </Button>
        </Flex>

        <AnimatePresence>
          {showForm && (
            <PaymentForm
              receivableToPay={null}
              receivables={receivables}
              existingPayments={payments}
              paymentToEdit={editingPayment}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingPayment(null);
              }}
            />
          )}
        </AnimatePresence>

        <PaymentFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
          receivables={receivables}
          paymentTypes={availablePaymentTypes}
          customers={[...new Set(receivables.map(r => r.customer_name).filter(Boolean))]}
        />

        <PaymentList
          payments={filteredPayments}
          getReceivableById={getReceivableById}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </Container>
    </Box>
  );
}
