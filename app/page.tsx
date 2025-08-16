'use client';
import React, { useState, useEffect } from "react";
import { Receivable, Payment } from "@/entities/all";
import { Button, Box, Text, Flex, Grid, GridItem, Container } from "@chakra-ui/react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import {
  Receipt,
  CreditCard,
  TrendingUp,
  Users,
  Plus,
} from "lucide-react";
import { format } from "date-fns";

import StatsCard from "@/components/dashboard/StatsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import CityBreakdown from "@/components/dashboard/CityBreakdown";

export default function Dashboard() {
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const calculateStats = () => {
    const totalReceivables = receivables.reduce(
      (sum, r) => sum + (r.amount || 0),
      0
    );
    const totalPayments = payments.reduce(
      (sum, p) => sum + (p.payment_amount || 0),
      0
    );
    const outstandingBalance = totalReceivables - totalPayments;

    const uniqueCustomers = new Set(receivables.map((r) => r.customer_name))
      .size;

    return {
      totalReceivables,
      totalPayments,
      outstandingBalance,
      uniqueCustomers,
    };
  };

  const stats = calculateStats();

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
            <Text fontSize="3xl" fontWeight="bold" color="gray.900">Dashboard</Text>
            <Text color="orange.600" mt={1} fontWeight="medium">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </Text>
          </Box>
          <Link href="/receivables">
            <Button 
              bgGradient="linear(to-r, orange.500, orange.600)" 
              _hover={{ bgGradient: "linear(to-r, orange.600, orange.700)" }} 
              color="white" 
              boxShadow="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Receivable
            </Button>
          </Link>
        </Flex>

        <Grid 
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} 
          gap={6} 
          mb={8}
        >
          <StatsCard
            title="Total Receivables"
            value={`${stats.totalReceivables.toLocaleString()} MMK`}
            icon={Receipt}
            gradient="linear(to-br, blue.500, blue.600)"
            isLoading={isLoading}
          />
          <StatsCard
            title="Total Payments"
            value={`${stats.totalPayments.toLocaleString()} MMK`}
            icon={CreditCard}
            gradient="linear(to-br, green.500, green.600)"
            isLoading={isLoading}
          />
          <StatsCard
            title="Outstanding Balance"
            value={`${stats.outstandingBalance.toLocaleString()} MMK`}
            icon={TrendingUp}
            gradient="linear(to-br, orange.500, orange.600)"
            isLoading={isLoading}
          />
          <StatsCard
            title="Active Customers"
            value={stats.uniqueCustomers.toString()}
            icon={Users}
            gradient="linear(to-br, purple.500, purple.600)"
            isLoading={isLoading}
          />
        </Grid>

        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          <GridItem>
            <RecentActivity
              receivables={receivables}
              payments={payments}
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
