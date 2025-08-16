import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardBody,
  CardHeader,
  Text,
  Button,
  Input,
  Textarea,
  Select,
  Flex,
  Box,
  VStack,
  HStack,
  Icon,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Save, Plus, X, Search } from "lucide-react";
import { format } from "date-fns";

const PREDEFINED_CITIES = [
  "Yangon",
  "Mandalay",
  "Naypyidaw",
  "Taunggyi",
  "Bago",
  "Mawlamyine",
  "Pathein",
  "Monywa",
  "Sittwe",
  "Myitkyina",
  "Lashio",
  "Hpa-an",
  "Dawei",
  "Pyay",
  "Magway",
  "Pakokku",
  "Loikaw",
  "Hakha",
];

interface ReceivableFormProps {
  receivable: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  existingCustomers?: string[];
  receivables?: any[];
}

export default function ReceivableForm({
  receivable,
  onSubmit,
  onCancel,
  existingCustomers = [],
  receivables = [],
}: ReceivableFormProps) {
  const [formData, setFormData] = useState(
    receivable || {
      date: format(new Date(), "yyyy-MM-dd"),
      customer_name: "",
      amount: "",
      city: "",
      description: "",
    }
  );
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showCustomCityInput, setShowCustomCityInput] = useState(false);
  const [customCity, setCustomCity] = useState("");
  const [allAvailableCities, setAllAvailableCities] = useState<string[]>([]);
  const isInitialRender = useRef(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update available cities whenever receivables change
  useEffect(() => {
    const existingCities = [
      ...new Set(receivables.map((r) => r.city).filter(Boolean)),
    ];
    const combinedCities = [
      ...new Set([...PREDEFINED_CITIES, ...existingCities]),
    ].sort();
    setAllAvailableCities(combinedCities);
  }, [receivables]);

  useEffect(() => {
    // On first render, if we're editing a receivable, don't override the city.
    if (receivable?.id && isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    isInitialRender.current = false;

    const customerName = formData.customer_name;
    // When the customer name changes to an existing customer, find their last used city.
    if (customerName && existingCustomers.includes(customerName)) {
      const mostRecentReceivableWithCity = receivables
        .filter((r) => r.customer_name === customerName && r.city)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

      // If we found a city and it's different from the one in the form, update it.
      if (
        mostRecentReceivableWithCity &&
        formData.city !== mostRecentReceivableWithCity.city
      ) {
        setFormData((prev: any) => ({
          ...prev,
          city: mostRecentReceivableWithCity.city,
        }));
      }
    }
  }, [formData.customer_name, existingCustomers, receivables, receivable]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCustomerDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCity = showCustomCityInput ? customCity.trim() : formData.city;

    onSubmit({
      ...formData,
      city: finalCity,
      amount: parseFloat(formData.amount) || 0,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCustomerSelect = (customerName: string) => {
    handleChange("customer_name", customerName);
    setShowCustomerDropdown(false);
  };

  const handleCitySelect = (value: string) => {
    if (value === "add_new_city") {
      setShowCustomCityInput(true);
      setCustomCity("");
    } else {
      setShowCustomCityInput(false);
      handleChange("city", value);
    }
  };

  const handleAddCustomCity = () => {
    if (customCity.trim()) {
      const newCity = customCity.trim();
      handleChange("city", newCity);

      // Add the new city to the available cities list immediately
      if (!allAvailableCities.includes(newCity)) {
        setAllAvailableCities((prev) => [...prev, newCity].sort());
      }

      setShowCustomCityInput(false);
      setCustomCity("");
    }
  };

  const filteredCustomers = existingCustomers.filter((customer) =>
    customer.toLowerCase().includes(formData.customer_name.toLowerCase())
  );

  const showAddNew =
    formData.customer_name &&
    !existingCustomers.some(
      (c) => c.toLowerCase() === formData.customer_name.toLowerCase()
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ marginBottom: "2rem" }}
    >
      <Card bg="white" border="1px solid" borderColor="orange.200" borderRadius="lg" boxShadow="xl">
        <CardHeader bgGradient="linear(to-r, orange.500, orange.600)" color="white" borderTopRadius="lg">
          <Flex align="center" justify="space-between">
            <Text fontSize="lg" fontWeight="semibold">
              {receivable?.id ? "Edit Receivable" : "Add New Receivable"}
            </Text>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
            >
              <Icon as={X} w="20px" h="20px" />
            </Button>
          </Flex>
        </CardHeader>
        <CardBody p={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                <VStack spacing={2} align="stretch">
                  <Text fontSize="sm" fontWeight="medium">Date</Text>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("date", e.target.value)}
                    required
                  />
                </VStack>
                <VStack spacing={2} align="stretch" ref={dropdownRef}>
                  <Text fontSize="sm" fontWeight="medium">Customer Name</Text>
                  <Box position="relative">
                    <Box position="relative">
                      <Icon as={Search} position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" w="16px" h="16px" />
                      <Input
                        id="customer_name"
                        placeholder="Search or add customer..."
                        value={formData.customer_name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChange("customer_name", e.target.value);
                          setShowCustomerDropdown(true);
                        }}
                        onFocus={() => setShowCustomerDropdown(true)}
                        pl={10}
                        autoComplete="off"
                        required
                      />
                    </Box>

                    {showCustomerDropdown && (
                      <Box
                        position="absolute"
                        zIndex={50}
                        w="full"
                        mt={1}
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        boxShadow="lg"
                        maxH="240px"
                        overflow="auto"
                      >
                        {filteredCustomers.length > 0 && (
                          <VStack spacing={0} align="stretch">
                            {filteredCustomers.map((customer) => (
                              <Button
                                key={customer}
                                type="button"
                                onClick={() => handleCustomerSelect(customer)}
                                variant="ghost"
                                justifyContent="flex-start"
                                w="full"
                                h="auto"
                                p={2}
                                _hover={{ bg: "gray.100" }}
                                _focus={{ bg: "gray.100" }}
                                borderRadius={0}
                              >
                                {customer}
                              </Button>
                            ))}
                          </VStack>
                        )}

                        {showAddNew && (
                          <Box borderTop="1px solid" borderColor="gray.200">
                            <Button
                              type="button"
                              onClick={() => handleCustomerSelect(formData.customer_name)}
                              variant="ghost"
                              justifyContent="flex-start"
                              w="full"
                              h="auto"
                              p={2}
                              _hover={{ bg: "gray.100" }}
                              _focus={{ bg: "gray.100" }}
                              borderRadius={0}
                              color="blue.600"
                            >
                              + Add new: <Text as="strong" ml={1}>{formData.customer_name}</Text>
                            </Button>
                          </Box>
                        )}

                        {filteredCustomers.length === 0 && !showAddNew && (
                          <Box px={4} py={2} color="gray.500" fontSize="sm">
                            No customers found.
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </VStack>
                <VStack spacing={2} align="stretch">
                  <Text fontSize="sm" fontWeight="medium">Amount (MMK)</Text>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("amount", e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </VStack>
                <VStack spacing={2} align="stretch">
                  <Text fontSize="sm" fontWeight="medium">City</Text>
                  {showCustomCityInput ? (
                    <HStack spacing={2}>
                      <Input
                        placeholder="Enter new city name..."
                        value={customCity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomCity(e.target.value)}
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustomCity();
                          }
                        }}
                        flex={1}
                        autoFocus
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddCustomCity}
                        isDisabled={!customCity.trim()}
                      >
                        <Icon as={Plus} w="16px" h="16px" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowCustomCityInput(false);
                          setCustomCity("");
                        }}
                      >
                        <Icon as={X} w="16px" h="16px" />
                      </Button>
                    </HStack>
                  ) : (
                    <Select
                      value={formData.city}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleCitySelect(e.target.value)}
                      required
                    >
                      {allAvailableCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                      <option value="add_new_city" style={{ color: "#2563eb", fontWeight: "500" }}>
                        Add new city...
                      </option>
                    </Select>
                  )}
                </VStack>
              </Grid>
              <VStack spacing={2} align="stretch">
                <Text fontSize="sm" fontWeight="medium">Description (Optional)</Text>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("description", e.target.value)}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </VStack>
              <Flex justify="end" gap={3}>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  bgGradient="linear(to-r, orange.500, orange.600)"
                  _hover={{ bgGradient: "linear(to-r, orange.600, orange.700)" }}
                  color="white"
                >
                  <Icon as={Save} w="16px" h="16px" mr={2} />
                  {receivable?.id ? "Update" : "Add"} Receivable
                </Button>
              </Flex>
            </VStack>
          </form>
        </CardBody>
      </Card>
    </motion.div>
  );
}
