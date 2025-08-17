'use client';
import React, { useState, useEffect } from "react";
import { Box, Container, Grid, GridItem, useToast } from "@chakra-ui/react";
import { Receipt, CreditCard, TrendingUp, Users } from "lucide-react";
import StatsCard from "./components/dashboard/StatsCard";
import RecentActivity from "./components/dashboard/RecentActivity";
import CityBreakdown from "./components/dashboard/CityBreakdown";
import { apiService } from "./lib/api";

export default function Dashboard() {
  const [receivables, setReceivables] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [receivablesResponse, paymentsResponse] = await Promise.all([
        apiService.getReceivables(),
        apiService.getPayments(),
      ]);
      
      setReceivables(receivablesResponse.data || []);
      setPayments(paymentsResponse.data || []);
    } catch (error: any) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Error loading data",
        description: error.message || "Failed to load dashboard data",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  const totalReceivables = receivables.reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalPaid = payments.reduce((sum, p) => sum + (p.payment_amount || 0), 0);
  const outstandingBalance = totalReceivables - totalPaid;
  const uniqueCustomers = new Set(receivables.map((r) => r.customer_name)).size;

  return (
    <Box p={6}>
      <Container maxW="7xl">
        <Grid 
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} 
          gap={6} 
          mb={8}
        >
          <StatsCard
            title="Total Receivables"
            value={`${totalReceivables.toLocaleString()} MMK`}
            icon={Receipt}
            gradient="linear(to-br, blue.500, blue.600)"
            isLoading={isLoading}
          />
          <StatsCard
            title="Total Payments"
            value={`${totalPaid.toLocaleString()} MMK`}
            icon={CreditCard}
            gradient="linear(to-br, green.500, green.600)"
            isLoading={isLoading}
          />
          <StatsCard
            title="Outstanding Balance"
            value={`${outstandingBalance.toLocaleString()} MMK`}
            icon={TrendingUp}
            gradient="linear(to-br, orange.500, orange.600)"
            isLoading={isLoading}
          />
          <StatsCard
            title="Active Customers"
            value={uniqueCustomers.toString()}
            icon={Users}
            gradient="linear(to-br, purple.500, purple.600)"
            isLoading={isLoading}
          />
        </Grid>
        
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          <GridItem>
            <RecentActivity
              receivables={receivables.slice(0, 5)}
              payments={payments.slice(0, 5)}
              isLoading={isLoading}
            />
          </GridItem>
          <GridItem>
            <CityBreakdown
              receivables={receivables}
              payments={payments}
              isLoading={isLoading}
            />
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
