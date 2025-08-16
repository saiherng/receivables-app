import React from "react";
import {
  Box,
  Card,
  CardBody,
  Text,
  Flex,
  Skeleton,
  Icon,
} from "@chakra-ui/react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  isLoading: boolean;
}

export default function StatsCard({
  title,
  value,
  icon: IconComponent,
  gradient,
  isLoading,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <Card bg="white" border="1px solid" borderColor="orange.200" borderRadius="lg" overflow="hidden">
        <CardBody p={6}>
          <Flex justify="space-between" align="center">
            <Box>
              <Skeleton height="16px" width="80px" mb={2} />
              <Skeleton height="32px" width="96px" />
            </Box>
            <Skeleton width="48px" height="48px" borderRadius="xl" />
          </Flex>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card 
      bg="white" 
      border="1px solid" 
      borderColor="orange.200" 
      borderRadius="lg" 
      overflow="hidden"
      _hover={{ boxShadow: "lg" }}
      transition="all 0.3s"
      position="relative"
    >
      <Box
        position="absolute"
        top="0"
        right="0"
        width="128px"
        height="128px"
        transform="translate(32px, -32px)"
        bgGradient={gradient}
        borderRadius="full"
        opacity="0.1"
      />
      <CardBody p={6}>
        <Flex justify="space-between" align="center">
          <Box>
            <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>
              {title}
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
              {value}
            </Text>
          </Box>
          <Box
            p={3}
            borderRadius="xl"
            bgGradient={gradient}
            boxShadow="lg"
          >
            <Icon as={IconComponent} w="24px" h="24px" color="white" />
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
}
