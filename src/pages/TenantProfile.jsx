import {
  Box,
  Flex,
  Heading,
  Text,
  Avatar,
  Stack,
  Badge,
  Spinner,
  Divider,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "../api/axios";

const TenantProfile = () => {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/tenants/me");
        setTenant(res.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!tenant) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Text>No profile found</Text>
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" bg="#F7FAFC" p={8}>
      <Box
        maxW="900px"
        w="100%"
        mx="auto"
        bg="white"
        p={8}
        rounded="2xl"
        shadow="md"
      >
        {/* Header */}
        <Flex align="center" mb={8}>
          <Avatar
            size="xl"
            name={tenant.user.name}
            mr={6}
          />
          <Box>
            <Heading size="lg">{tenant.user.name}</Heading>
            <Text color="gray.500">{tenant.user.email}</Text>
            <Badge
              mt={2}
              colorScheme={tenant.user.isActive ? "green" : "red"}
              rounded="lg"
              px={3}
              py={1}
            >
              {tenant.user.isActive ? "Active" : "Inactive"}
            </Badge>
          </Box>
        </Flex>

        <Divider mb={8} />

        {/* Info Grid */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <InfoItem label="Phone" value={tenant.phone} />
          <InfoItem label="National ID" value={tenant.nationalId} />
          <InfoItem label="Emergency Contact" value={tenant.emergencyContact} />
          <InfoItem
            label="Joined"
            value={new Date(tenant.createdAt).toLocaleDateString()}
          />
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

const InfoItem = ({ label, value }) => (
  <Box>
    <Text fontSize="sm" color="gray.500">
      {label}
    </Text>
    <Text fontWeight="bold" fontSize="md">
      {value || "N/A"}
    </Text>
  </Box>
);

export default TenantProfile;
