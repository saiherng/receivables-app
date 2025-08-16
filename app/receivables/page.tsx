'use client';
import React, { useState, useEffect } from "react";
import { Receivable, Payment } from "@/entities/all";
import { Button, Box, Text, Flex, Container } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import ReceivableForm from "../components/receivables/ReceivableForm";
import ReceivableList from "../components/receivables/ReceivableList";
import FilterBar from "../components/receivables/FilterBar";
import PaymentForm from "../components/payments/PaymentForm";

export default function Receivables() {
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReceivable, setEditingReceivable] = useState<Receivable | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payingReceivable, setPayingReceivable] = useState<Receivable | null>(null);
  const [filters, setFilters] = useState({
    customer: "",
    city: "all",
    dateFrom: "",
    dateTo: "",
    status: "all",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [receivablesData, paymentsData] = await Promise.all([
        Receivable.getAll(),
        Payment.getAll(),
      ]);
      setReceivables(receivablesData);
      setPayments(paymentsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (receivableData: any) => {
    try {
      if (editingReceivable) {
        await Receivable.update(editingReceivable.id, receivableData);
      } else {
        await Receivable.create(receivableData);
      }
      setShowForm(false);
      setEditingReceivable(null);
      loadData();
    } catch (error) {
      console.error("Error saving receivable:", error);
    }
  };

  const handlePaymentSubmit = async (paymentData: any) => {
    try {
      await Payment.create(paymentData);
      setShowPaymentForm(false);
      setPayingReceivable(null);
      loadData();
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  const handleEdit = (receivable: Receivable) => {
    setEditingReceivable(receivable);
    setShowForm(true);
  };

  const handleRecordPayment = (receivable: Receivable) => {
    setPayingReceivable(receivable);
    setShowPaymentForm(true);
  };

  const handleDelete = async (receivableId: string) => {
    try {
      await Receivable.delete(receivableId);
      loadData();
    } catch (error) {
      console.error("Error deleting receivable:", error);
    }
  };

  const getReceivablePayments = (receivableId: string) => {
    return payments.filter((p) => p.receivable_id === receivableId);
  };

  const getReceivableStatus = (receivable: Receivable) => {
    const paymentsForReceivable = getReceivablePayments(receivable.id);
    const paidAmount = paymentsForReceivable.reduce(
      (sum, p) => sum + (p.payment_amount || 0),
      0
    );
    const remainingAmount = (receivable.amount || 0) - paidAmount;

    if (receivable.amount > 0 && remainingAmount <= 0) return "Paid";
    if (paidAmount > 0 && remainingAmount > 0) return "Partial";
    return "Unpaid";
  };

  const filteredReceivables = receivables.filter((receivable) => {
    const customerMatch =
      !filters.customer ||
      receivable.customer_name
        .toLowerCase()
        .includes(filters.customer.toLowerCase());
    const cityMatch =
      filters.city === "all" || receivable.city === filters.city;
    const dateFromMatch =
      !filters.dateFrom || receivable.date >= filters.dateFrom;
    const dateToMatch = !filters.dateTo || receivable.date <= filters.dateTo;
    const statusMatch =
      filters.status === "all" ||
      getReceivableStatus(receivable) === filters.status;

    return (
      customerMatch && cityMatch && dateFromMatch && dateToMatch && statusMatch
    );
  });

  const handleClearFilters = () => {
    setFilters({
      customer: "",
      city: "all",
      dateFrom: "",
      dateTo: "",
      status: "all",
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
            <Text fontSize="3xl" fontWeight="bold" color="gray.900">Receivables</Text>
            <Text color="gray.600" mt={1}>
              Manage your daily receivables entries
            </Text>
          </Box>
          <Button
            onClick={() => setShowForm(!showForm)}
            bgGradient="linear(to-r, orange.500, orange.600)" 
            _hover={{ bgGradient: "linear(to-r, orange.600, orange.700)" }} 
            color="white" 
            boxShadow="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Receivable
          </Button>
        </Flex>

        <AnimatePresence>
          {showForm && (
            <ReceivableForm
              receivable={editingReceivable}
              existingCustomers={[
                ...new Set(receivables.map((r) => r.customer_name)),
              ]}
              receivables={receivables}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingReceivable(null);
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPaymentForm && (
            <PaymentForm
              receivableToPay={payingReceivable}
              receivables={receivables}
              existingPayments={payments}
              paymentToEdit={null}
              onSubmit={handlePaymentSubmit}
              onCancel={() => {
                setShowPaymentForm(false);
                setPayingReceivable(null);
              }}
            />
          )}
        </AnimatePresence>

        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
          customers={[...new Set(receivables.map((r) => r.customer_name))]}
          receivables={receivables}
        />

        <ReceivableList
          receivables={filteredReceivables}
          getReceivablePayments={getReceivablePayments}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRecordPayment={handleRecordPayment}
          isLoading={isLoading}
        />
      </Container>
    </Box>
  );
}
