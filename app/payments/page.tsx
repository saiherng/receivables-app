'use client';
import React, { useState, useEffect } from "react";
import { Receivable, Payment } from "@/entities/all";
import { Button, Box, Text, Flex, Container } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import PaymentForm from "../components/payments/PaymentForm";
import PaymentList from "../components/payments/PaymentList";
import PaymentFilters from "../components/payments/PaymentFilters";

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [filters, setFilters] = useState({
    customer: "",
    paymentType: "all",
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [paymentsData, receivablesData] = await Promise.all([
        Payment.getAll(),
        Receivable.getAll(),
      ]);
      setPayments(paymentsData);
      setReceivables(receivablesData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (paymentData: any) => {
    try {
      if (editingPayment) {
        const updatedPayment = await Payment.update(
          editingPayment.id,
          paymentData
        );
        setPayments((prevPayments) =>
          prevPayments.map((p) =>
            p.id === editingPayment.id ? updatedPayment : p
          )
        );
      } else {
        const newPayment = await Payment.create(paymentData);
        // Add new payment to the beginning of the list
        setPayments((prevPayments) => [newPayment, ...prevPayments]);
      }
      setShowForm(false);
      setEditingPayment(null);
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleDelete = async (paymentId: string) => {
    try {
      await Payment.delete(paymentId);
      setPayments((prevPayments) =>
        prevPayments.filter((p) => p.id !== paymentId)
      );
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  const getReceivableById = (id: string) => {
    return receivables.find((r) => r.id === id);
  };

  const filteredPayments = payments.filter((payment) => {
    const receivable = getReceivableById(payment.receivable_id);
    const customerName = receivable?.customer_name || "";

    const customerMatch =
      !filters.customer ||
      customerName.toLowerCase().includes(filters.customer.toLowerCase());
    const paymentTypeMatch =
      filters.paymentType === "all" ||
      payment.payment_type === filters.paymentType;
    const dateFromMatch =
      !filters.dateFrom || payment.payment_date >= filters.dateFrom;
    const dateToMatch =
      !filters.dateTo || payment.payment_date <= filters.dateTo;

    return customerMatch && paymentTypeMatch && dateFromMatch && dateToMatch;
  });

  const handleClearFilters = () => {
    setFilters({
      customer: "",
      paymentType: "all",
      dateFrom: "",
      dateTo: "",
    });
  };

  // Get ALL unique payment types from payments (not filtered)
  const allPaymentTypes = [
    ...new Set(payments.map((p) => p.payment_type).filter(Boolean)),
  ].sort();

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
              Track and record customer payments
            </Text>
          </Box>
          <Button
            onClick={() => {
              setEditingPayment(null);
              setShowForm(!showForm);
            }}
            bgGradient="linear(to-r, green.500, green.600)" 
            _hover={{ bgGradient: "linear(to-r, green.600, green.700)" }} 
            color="white" 
            boxShadow="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Record Payment
          </Button>
        </Flex>

        <AnimatePresence>
          {showForm && (
            <PaymentForm
              receivables={receivables}
              existingPayments={payments}
              paymentToEdit={editingPayment}
              receivableToPay={null}
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
          paymentTypes={allPaymentTypes}
          receivables={receivables}
        />

        <PaymentList
          payments={filteredPayments}
          getReceivableById={getReceivableById}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Container>
    </Box>
  );
}
