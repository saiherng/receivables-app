
'use client';
import React, { useState, useEffect } from "react";
import { Receivable, Payment } from "@/entities/all";
import { Input, Box, Text, Container, Icon } from "@chakra-ui/react";
import { Search } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import CustomerList from "../components/customers/CustomerList";
import CustomerDetail from "../components/customers/CustomerDetail";
import ReceivableForm from "../components/receivables/ReceivableForm";
import PaymentForm from "../components/payments/PaymentForm";

export default function Customers() {
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showReceivableForm, setShowReceivableForm] = useState(false);
  const [customerForReceivable, setCustomerForReceivable] = useState<any>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payingCustomer, setPayingCustomer] = useState<any>(null);
  const [editingPayment, setEditingPayment] = useState<any>(null);

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

  const calculateCustomerData = () => {
    const customerMap = new Map();

    receivables.forEach((receivable) => {
      const key = receivable.customer_name;
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          name: receivable.customer_name,
          totalReceivables: 0,
          totalPaid: 0,
          receivableCount: 0,
          cities: new Set(),
        });
      }

      const customer = customerMap.get(key);
      customer.totalReceivables += receivable.amount || 0;
      customer.receivableCount += 1;
      if (receivable.city) {
        customer.cities.add(receivable.city);
      }
    });

    payments.forEach((payment) => {
      const receivable = receivables.find(
        (r) => r.id === payment.receivable_id
      );
      if (receivable) {
        const customer = customerMap.get(receivable.customer_name);
        if (customer) {
          customer.totalPaid += payment.payment_amount || 0;
        }
      }
    });

    return Array.from(customerMap.values()).map((customer) => ({
      ...customer,
      cities: Array.from(customer.cities).sort(),
      outstandingBalance: customer.totalReceivables - customer.totalPaid,
    }));
  };

  const customerData = calculateCustomerData();

  const filteredCustomers = customerData.filter((customer) => {
    return customer.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCustomerSelect = (customer: any) => {
    const customerReceivables = receivables
      .filter((r) => r.customer_name === customer.name)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const receivableIds = new Set(customerReceivables.map((r) => r.id));

    const customerPayments = payments
      .filter((p) => receivableIds.has(p.receivable_id))
      .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());

    setSelectedCustomer({
      ...customer,
      receivables: customerReceivables,
      payments: customerPayments,
    });
  };

  const handleAddReceivable = (customer: any) => {
    setCustomerForReceivable(customer);
    setShowReceivableForm(true);
  };

  const handleReceivableSubmit = async (receivableData: any) => {
    try {
      await Receivable.create(receivableData);
      setShowReceivableForm(false);
      setCustomerForReceivable(null);
      loadData(); // Reload data to reflect the new receivable
    } catch (error) {
      console.error("Error saving receivable:", error);
    }
  };

  const handleRecordPayment = (customer: any) => {
    setPayingCustomer(customer);
    setShowPaymentForm(true);
  };

  const handleEditPayment = (payment: any) => {
    setEditingPayment(payment);
    setSelectedCustomer(null); // Close the detail view while editing
    setShowPaymentForm(true);
  };

  const handleDeletePayment = async (paymentId: string) => {
    try {
      await Payment.delete(paymentId);

      // Close the detail view to ensure it reloads with fresh data
      if (selectedCustomer) {
        setSelectedCustomer(null);
      }

      await loadData(); // Reload all data and update states
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  const handlePaymentSubmit = async (paymentData: any) => {
    try {
      if (editingPayment) {
        await Payment.update(editingPayment.id, paymentData);
      } else {
        await Payment.create(paymentData);
      }
      setShowPaymentForm(false);
      setPayingCustomer(null);
      setEditingPayment(null);

      // Close the detail view to ensure it reloads with fresh data
      if (selectedCustomer) {
        setSelectedCustomer(null);
      }

      await loadData(); // Reload all data and update states
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  return (
    <Box p={{ base: 4, md: 6 }}>
      <Container maxW="7xl">
        <Box mb={{ base: 6, md: 8 }}>
          <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="gray.900">
            Customers
          </Text>
          <Text color="gray.600" mt={1}>
            Overview of customer balances and payments
          </Text>
        </Box>

        <Box mb={6}>
          <Box position="relative">
            <Icon 
              as={Search} 
              position="absolute" 
              left={3} 
              top="50%" 
              transform="translateY(-50%)" 
              color="gray.400" 
              w="20px" 
              h="20px" 
            />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              pl={10}
            />
          </Box>
        </Box>

        <AnimatePresence>
          {showReceivableForm && (
            <ReceivableForm
              receivable={{
                customer_name: customerForReceivable?.name || "",
                date: new Date().toISOString().split("T")[0],
                amount: "",
                city: "",
                description: "",
              }}
              existingCustomers={[
                ...new Set(receivables.map((r) => r.customer_name)),
              ]}
              receivables={receivables}
              onSubmit={handleReceivableSubmit}
              onCancel={() => {
                setShowReceivableForm(false);
                setCustomerForReceivable(null);
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPaymentForm && (
            <PaymentForm
              paymentToEdit={editingPayment}
              receivableToPay={null}
              receivables={receivables.filter((r) => {
                if (editingPayment) {
                  // If editing, only show the relevant receivable
                  return r.id === editingPayment.receivable_id;
                }
                if (payingCustomer && r.customer_name !== payingCustomer.name)
                  return false;

                const paidAmount = payments
                  .filter((p) => p.receivable_id === r.id)
                  .reduce((sum, p) => sum + p.payment_amount, 0);
                return r.amount > paidAmount;
              })}
              existingPayments={payments}
              onSubmit={handlePaymentSubmit}
              onCancel={() => {
                setShowPaymentForm(false);
                setPayingCustomer(null);
                setEditingPayment(null); // Reset editingPayment on cancel
              }}
            />
          )}
        </AnimatePresence>

        <CustomerList
          customers={filteredCustomers}
          isLoading={isLoading}
          onRowClick={handleCustomerSelect}
          onAddReceivable={handleAddReceivable}
          onRecordPayment={handleRecordPayment}
        />
      </Container>
      <AnimatePresence>
        {selectedCustomer && (
          <CustomerDetail
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
            onEditPayment={handleEditPayment} // Added prop
            onDeletePayment={handleDeletePayment}
          />
        )}
      </AnimatePresence>
    </Box>
  );
}
