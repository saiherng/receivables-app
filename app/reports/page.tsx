'use client';
import React, { useState, useEffect } from "react";
import { Box, Container, Grid, GridItem, useToast, Icon, Text as ChakraText } from "@chakra-ui/react";
import { BarChart3, TrendingUp, Calendar, Filter } from "lucide-react";
import { apiService } from "../lib/api";
import RevenueChart from "../components/reports/RevenueChart";
import PaymentTrends from "../components/reports/PaymentTrends";
import CustomerPerformance from "../components/reports/CustomerPerformance";
import CityAnalysis from "../components/reports/CityAnalysis";
import ReportFilters from "../components/reports/ReportFilters";
import SummaryCards from "../components/reports/SummaryCards";

export default function Reports() {
  const [receivables, setReceivables] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of year
    endDate: new Date().toISOString().split('T')[0] // Today
  });
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const toast = useToast();

  // Load initial data when component mounts
  useEffect(() => {
    loadData();
  }, []); // Only run once on mount

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [receivablesResponse, paymentsResponse] = await Promise.all([
        apiService.getReceivables(),
        apiService.getPayments(),
      ]);
      
      // Get all data first
      const allReceivables = receivablesResponse.data || [];
      const allPayments = paymentsResponse.data || [];
      
      let filteredReceivables = [...allReceivables];
      let filteredPayments = [...allPayments];

      // Apply date range filter
      if (dateRange.startDate && dateRange.endDate) {
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        
        filteredReceivables = filteredReceivables.filter((r: any) => {
          if (!r.date) return false;
          const receivableDate = new Date(r.date);
          return receivableDate >= startDate && receivableDate <= endDate;
        });

        filteredPayments = filteredPayments.filter((p: any) => {
          if (!p.payment_date) return false;
          const paymentDate = new Date(p.payment_date);
          return paymentDate >= startDate && paymentDate <= endDate;
        });
      }

      // Apply customer filter
      if (selectedCustomer) {
        filteredReceivables = filteredReceivables.filter((r: any) => 
          r.customer_name === selectedCustomer
        );
        // Get all receivable IDs for this customer from original data
        const customerReceivableIds = allReceivables
          .filter((r: any) => r.customer_name === selectedCustomer)
          .map((r: any) => r.id);
        filteredPayments = allPayments.filter((p: any) => 
          customerReceivableIds.includes(p.receivable_id)
        );
        
        // Re-apply date filter to payments if needed
        if (dateRange.startDate && dateRange.endDate) {
          const startDate = new Date(dateRange.startDate);
          const endDate = new Date(dateRange.endDate);
          filteredPayments = filteredPayments.filter((p: any) => {
            if (!p.payment_date) return false;
            const paymentDate = new Date(p.payment_date);
            return paymentDate >= startDate && paymentDate <= endDate;
          });
        }
      }

      // Apply city filter
      if (selectedCity) {
        filteredReceivables = filteredReceivables.filter((r: any) => 
          r.city === selectedCity
        );
        // Get all receivable IDs for this city from original data
        const cityReceivableIds = allReceivables
          .filter((r: any) => r.city === selectedCity)
          .map((r: any) => r.id);
        
        // If customer filter is also applied, intersect the receivable IDs
        if (selectedCustomer) {
          const customerReceivableIds = allReceivables
            .filter((r: any) => r.customer_name === selectedCustomer && r.city === selectedCity)
            .map((r: any) => r.id);
          filteredPayments = allPayments.filter((p: any) => 
            customerReceivableIds.includes(p.receivable_id)
          );
        } else {
          filteredPayments = allPayments.filter((p: any) => 
            cityReceivableIds.includes(p.receivable_id)
          );
        }
        
        // Re-apply date filter to payments if needed
        if (dateRange.startDate && dateRange.endDate) {
          const startDate = new Date(dateRange.startDate);
          const endDate = new Date(dateRange.endDate);
          filteredPayments = filteredPayments.filter((p: any) => {
            if (!p.payment_date) return false;
            const paymentDate = new Date(p.payment_date);
            return paymentDate >= startDate && paymentDate <= endDate;
          });
        }
      }

      console.log('Loaded data:', {
        totalReceivables: allReceivables.length,
        totalPayments: allPayments.length,
        filteredReceivables: filteredReceivables.length,
        filteredPayments: filteredPayments.length,
        dateRange,
        selectedCustomer,
        selectedCity
      });

      setReceivables(filteredReceivables);
      setPayments(filteredPayments);
    } catch (error: any) {
      console.error("Error loading reports data:", error);
      toast({
        title: "Error loading data",
        description: error.message || "Failed to load reports data",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      // Set empty arrays on error
      setReceivables([]);
      setPayments([]);
    }
    setIsLoading(false);
  };

  const totalReceivables = receivables.reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalPaid = payments.reduce((sum, p) => sum + (p.payment_amount || 0), 0);
  const outstandingBalance = totalReceivables - totalPaid;
  const collectionRate = totalReceivables > 0 ? (totalPaid / totalReceivables) * 100 : 0;
  
  // Check if data has been loaded
  const hasData = receivables.length > 0 || payments.length > 0;

  return (
    <Box p={6}>
      <Container maxW="7xl">
        {/* Page Header */}
        <Box mb={8}>
          <Box display="flex" alignItems="center" gap={3} mb={2}>
            <BarChart3 size={32} className="text-orange-500" />
            <Box>
              <ChakraText fontSize="3xl" fontWeight="bold" color="gray.900">
                Financial Reports
              </ChakraText>
              <ChakraText color="gray.600" fontSize="lg">
                Comprehensive analysis of receivables and payments
              </ChakraText>
            </Box>
          </Box>
        </Box>

        {/* Filters */}
        <Box mb={6}>
          <ReportFilters
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            selectedCustomer={selectedCustomer}
            onCustomerChange={setSelectedCustomer}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            receivables={receivables}
            isLoading={isLoading}
            onGenerateReport={loadData}
          />
        </Box>

        {/* Summary Cards */}
        <Box mb={8}>
          <SummaryCards
            totalReceivables={totalReceivables}
            totalPaid={totalPaid}
            outstandingBalance={outstandingBalance}
            collectionRate={collectionRate}
            isLoading={isLoading}
          />
        </Box>

        {/* No Data Message */}
        {!isLoading && !hasData && (
          <Box mb={8} textAlign="center" py={12}>
            <Box
              p={8}
              borderRadius="lg"
              border="2px dashed"
              borderColor="gray.300"
              bg="gray.50"
            >
              <Icon as={BarChart3} w="16" h="16" color="gray.400" mb={4} />
              <ChakraText fontSize="lg" color="gray.600" mb={2}>
                No data available for the selected filters
              </ChakraText>
              <ChakraText fontSize="sm" color="gray.500">
                Adjust your filters and click &quot;Generate Report&quot; to view data
              </ChakraText>
            </Box>
          </Box>
        )}

        {/* Charts Grid - Only show when there's data */}
        {hasData && (
          <>
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8} mb={8}>
              <GridItem>
                <RevenueChart
                  receivables={receivables}
                  payments={payments}
                  isLoading={isLoading}
                />
              </GridItem>
              <GridItem>
                <PaymentTrends
                  payments={payments}
                  isLoading={isLoading}
                />
              </GridItem>
            </Grid>

            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8}>
              <GridItem>
                <CustomerPerformance
                  receivables={receivables}
                  payments={payments}
                  isLoading={isLoading}
                />
              </GridItem>
              <GridItem>
                <CityAnalysis
                  receivables={receivables}
                  payments={payments}
                  isLoading={isLoading}
                />
              </GridItem>
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
}
