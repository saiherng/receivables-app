import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Text,
  Flex,
  Box,
  Badge,
  Skeleton,
  Icon,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { Clock, Receipt, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { Receivable, Payment } from "@/entities/all";

interface RecentActivityProps {
  receivables: Receivable[];
  payments: Payment[];
  isLoading: boolean;
}

export default function RecentActivity({ receivables, payments, isLoading }: RecentActivityProps) {
  const recentItems = [
    ...receivables.map((r) => ({ ...r, type: "receivable", sortDate: r.date })),
    ...payments.map((p) => ({
      ...p,
      type: "payment",
      sortDate: p.payment_date,
    })),
  ]
    .sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime())
    .slice(0, 8);

  if (isLoading) {
    return (
      <Card bg="white" border="1px solid" borderColor="orange.200" borderRadius="lg">
        <CardHeader>
          <Flex align="center" gap={2}>
            <Icon as={Clock} w="20px" h="20px" />
            <Text fontSize="lg" fontWeight="semibold">Recent Activity</Text>
          </Flex>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Flex key={i} align="center" gap={4} p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Skeleton width="40px" height="40px" borderRadius="full" />
                  <Box flex="1">
                    <Skeleton height="16px" width="128px" mb={2} />
                    <Skeleton height="12px" width="96px" />
                  </Box>
                  <Skeleton height="24px" width="64px" borderRadius="full" />
                </Flex>
              ))}
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card bg="white" border="1px solid" borderColor="orange.200" borderRadius="lg">
      <CardHeader>
        <Flex align="center" gap={2}>
          <Icon as={Clock} w="20px" h="20px" />
          <Text fontSize="lg" fontWeight="semibold">Recent Activity</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <VStack spacing={3} align="stretch">
          {recentItems.map((item: any, index) => {
            const receivableForPayment =
              item.type === "payment"
                ? receivables.find((r) => r.id === item.receivable_id)
                : null;

            return (
              <Flex
                key={index}
                align="center"
                gap={4}
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.100"
                _hover={{ bg: "gray.50" }}
                transition="colors"
              >
                <Box
                  p={2}
                  borderRadius="full"
                  bg={item.type === "receivable" ? "blue.100" : "green.100"}
                  color={item.type === "receivable" ? "blue.600" : "green.600"}
                >
                  <Icon 
                    as={item.type === "receivable" ? Receipt : CreditCard} 
                    w="20px" 
                    h="20px" 
                  />
                </Box>
                <Box flex="1">
                  <Text fontWeight="medium" color="gray.900">
                    {item.type === "receivable"
                      ? `New receivable from ${item.customer_name}`
                      : `Payment from ${
                          receivableForPayment?.customer_name || "a customer"
                        }`}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {format(new Date(item.sortDate), "MMM d, yyyy")}
                  </Text>
                </Box>
                <Box textAlign="right">
                  <Text fontWeight="semibold" color="gray.900">
                    {(item.amount || item.payment_amount || 0).toLocaleString()}{" "}
                    MMK
                  </Text>
                  <Badge
                    colorScheme={item.type === "receivable" ? "blue" : "green"}
                    fontSize="xs"
                    mt={1}
                  >
                    {item.type === "receivable" ? item.city : item.payment_type}
                  </Badge>
                </Box>
              </Flex>
            );
          })}
        </VStack>
      </CardBody>
    </Card>
  );
}
