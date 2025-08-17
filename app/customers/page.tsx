
'use client';
import React, { useState, useEffect } from "react";
import { Box, Text, Container, useToast } from "@chakra-ui/react";
import CustomerList from "../components/customers/CustomerList";
import { apiService } from "../lib/api";

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const customerSummaries = await apiService.getAllCustomerSummaries();
      setCustomers(customerSummaries);
    } catch (error: any) {
      console.error("Error loading customers data:", error);
      toast({
        title: "Error loading data",
        description: error.message || "Failed to load customer data",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };



  const handleAddReceivable = (customer: any) => {
    toast({
      title: "Add Receivable",
      description: `Add receivable for ${customer.name}`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRecordPayment = (customer: any) => {
    toast({
      title: "Record Payment",
      description: `Record payment for ${customer.name}`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={6}>
      <Container maxW="7xl">
        <Box mb={8}>
          <Text fontSize="3xl" fontWeight="bold" color="gray.900">Customers</Text>
          <Text color="gray.600" mt={1}>
            View customer summaries and payment history
          </Text>
        </Box>

        <CustomerList 
          customers={customers} 
          isLoading={isLoading}
          onRefresh={loadData}
        />
      </Container>
    </Box>
  );
}
