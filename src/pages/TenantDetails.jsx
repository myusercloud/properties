import {
  Box,
  Flex,
  Heading,
  Text,
  Avatar,
  Badge,
  Stack,
  Divider,
  SimpleGrid,
  Spinner,
  Center,
  Button,
  HStack,
  useToast,
  Icon,
  Tabs,
  TabList,
  Tab,
  IconButton,
} from "@chakra-ui/react";

import { 
  FiArrowLeft, FiPhone, FiMail, FiCreditCard, 
  FiAlertCircle, FiCalendar, FiEdit, FiTrash2, 
  FiMessageSquare, FiUser, FiActivity
} from "react-icons/fi";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";



const TenantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/tenants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTenant(res.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch tenant details",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();
  }, [id, toast]);

  if (loading) return <Center minH="100vh"><Spinner size="xl" thickness="4px" color="blue.500" /></Center>;
  if (!tenant) return <Center minH="100vh"><Text fontSize="xl" fontWeight="bold">Tenant not found</Text></Center>;

  return (
    <Box bg="#F8FAFC" minH="100vh" p={{ base: 4, md: 10 }}>
      <Box maxW="1000px" mx="auto">
        
        {/* Top Navigation */}
        <Flex justify="space-between" align="center" mb={8}>
          <Button 
            leftIcon={<FiArrowLeft />} 
            variant="ghost" 
            onClick={() => navigate(-1)}
            _hover={{ bg: "white" }}
          >
            Back to Directory
          </Button>
          <HStack spacing={3}>
            <IconButton
  icon={<FiEdit />}
  aria-label="Edit"
  onClick={() => navigate(`/tenants/${tenant.id}/edit`)}
  rounded="lg"
/>

            <IconButton icon={<FiTrash2 />} aria-label="Delete" colorScheme="red" variant="ghost" rounded="lg" />
          </HStack>
        </Flex>

        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
          
          {/* LEFT COLUMN: Profile Summary */}
          <Stack spacing={6}>
            <Box bg="white" p={8} rounded="3xl" shadow="sm" textAlign="center" border="1px solid" borderColor="gray.100">
              <Avatar size="2xl" name={tenant.user.name} mb={4} shadow="xl" border="4px solid white" />
              <Heading size="md" mb={1}>{tenant.user.name}</Heading>
              <Text color="gray.500" fontSize="sm" mb={4}>{tenant.user.email}</Text>
              <Badge
                colorScheme={tenant.user.isActive ? "green" : "red"}
                variant="subtle"
                rounded="full"
                px={4}
                py={1}
                fontSize="xs"
              >
                {tenant.user.isActive ? "ACTIVE TENANT" : "INACTIVE"}
              </Badge>
              
              <Divider my={6} />
              
              <Stack spacing={4}>
                <Button leftIcon={<FiMessageSquare />} colorScheme="blue" size="md" rounded="xl">
                  Message Tenant
                </Button>
                <Button leftIcon={<FiPhone />} variant="outline" size="md" rounded="xl">
                  Call {tenant.phone}
                </Button>
              </Stack>
            </Box>
          </Stack>

          {/* RIGHT COLUMN: Detailed Info */}
          <Box gridColumn={{ lg: "span 2" }}>
            <Box bg="white" rounded="3xl" shadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">
              <Tabs variant="line" colorScheme="blue">
                <TabList px={8} pt={4} borderBottom="1px solid" borderColor="gray.50">
                  <Tab fontSize="sm" fontWeight="bold" pb={4}>Information</Tab>
                  <Tab fontSize="sm" fontWeight="bold" pb={4}>Lease History</Tab>
                  <Tab fontSize="sm" fontWeight="bold" pb={4}>Payments</Tab>
                </TabList>

                <Box p={8}>
                  <Text fontSize="xs" fontWeight="bold" color="blue.500" mb={6} textTransform="uppercase" letterSpacing="widest">
                    Personal Records
                  </Text>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacingY={8} spacingX={10}>
                    <Info icon={FiPhone} label="Phone Number" value={tenant.phone} />
                    <Info icon={FiCreditCard} label="National ID" value={tenant.nationalId} />
                    <Info icon={FiAlertCircle} label="Emergency Contact" value={tenant.emergencyContact} />
                    <Info icon={FiCalendar} label="Lease Start Date" value={new Date(tenant.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })} />
                    <Info icon={FiUser} label="System ID" value={tenant.id.slice(0, 12)} />
                    <Info icon={FiActivity} label="Role Permission" value={tenant.user.role} />
                  </SimpleGrid>

                  <Box mt={10} p={5} bg="blue.50" rounded="2xl" border="1px solid" borderColor="blue.100">
                    <HStack spacing={4}>
                      <Icon as={FiAlertCircle} color="blue.500" boxSize={5} />
                      <Box>
                        <Text fontSize="sm" fontWeight="bold" color="blue.800">Account Note</Text>
                        <Text fontSize="xs" color="blue.600">Tenant has no outstanding maintenance requests as of today.</Text>
                      </Box>
                    </HStack>
                  </Box>
                </Box>
              </Tabs>
            </Box>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

// --- Modern Info Component ---
const Info = ({ icon, label, value }) => (
  <HStack spacing={4} align="flex-start">
    <Center bg="gray.50" p={2} rounded="lg">
      <Icon as={icon} color="gray.400" />
    </Center>
    <Box>
      <Text fontSize="xs" color="gray.500" fontWeight="medium">
        {label}
      </Text>
      <Text fontWeight="bold" fontSize="md" color="gray.800">
        {value || "Not provided"}
      </Text>
    </Box>
  </HStack>
);


export default TenantDetails;