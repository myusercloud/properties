import {
  Box,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Button,
  Stack,
  useToast,
  Spinner,
  Center,
  Flex,
  Text,
  Icon,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { FiUser, FiMail, FiPhone, FiCreditCard, FiAlertCircle, FiChevronRight, FiSave } from "react-icons/fi";

const EditTenant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    nationalId: "",
    emergencyContact: "",
  });

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/tenants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tenant = res.data;
        setForm({
          name: tenant.user.name,
          email: tenant.user.email,
          phone: tenant.phone || "",
          nationalId: tenant.nationalId || "",
          emergencyContact: tenant.emergencyContact || "",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load tenant",
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Good practice even if not a formal <form>
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/tenants/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
        status: "success",
        duration: 3000,
        variant: "subtle",
      });

      navigate(`/tenants/${id}`);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <Center minH="100vh" bg="gray.50">
        <Spinner size="xl" thickness="4px" color="blue.500" />
      </Center>
    );
  }

  return (
    <Box p={{ base: 4, md: 10 }} bg="gray.50" minH="100vh">
      <Box maxW="800px" mx="auto">
        
        {/* Breadcrumb Header */}
        <Breadcrumb spacing="8px" separator={<FiChevronRight color="gray.500" />} mb={4}>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate("/allTenants")} color="gray.500">Tenants</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink fontWeight="bold">{form.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading size="lg" fontWeight="800">Edit Profile</Heading>
            <Text color="gray.500" fontSize="sm">Update tenant personal information and contact details.</Text>
          </Box>
        </Flex>

        {/* Edit Card */}
        <Box bg="white" p={{ base: 6, md: 10 }} rounded="3xl" shadow="sm" border="1px solid" borderColor="gray.100">
          <form onSubmit={handleUpdate}>
            <Stack spacing={8}>
              
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="blue.500" mb={4} textTransform="uppercase" letterSpacing="widest">
                  Identity Details
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <CustomFormField 
                    label="Full Name" 
                    name="name" 
                    icon={FiUser} 
                    value={form.name} 
                    onChange={handleChange} 
                  />
                  <CustomFormField 
                    label="National ID" 
                    name="nationalId" 
                    icon={FiCreditCard} 
                    value={form.nationalId} 
                    onChange={handleChange} 
                  />
                </SimpleGrid>
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="blue.500" mb={4} textTransform="uppercase" letterSpacing="widest">
                  Contact Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <CustomFormField 
                    label="Email Address" 
                    name="email" 
                    icon={FiMail} 
                    value={form.email} 
                    onChange={handleChange} 
                  />
                  <CustomFormField 
                    label="Phone Number" 
                    name="phone" 
                    icon={FiPhone} 
                    value={form.phone} 
                    onChange={handleChange} 
                  />
                </SimpleGrid>
                <Box mt={6}>
                  <CustomFormField 
                    label="Emergency Contact Info" 
                    name="emergencyContact" 
                    icon={FiAlertCircle} 
                    value={form.emergencyContact} 
                    onChange={handleChange} 
                    placeholder="Name and Phone Number"
                  />
                </Box>
              </Box>

              <Flex pt={4} gap={4} justify="flex-end">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate(-1)} 
                  rounded="xl" 
                  px={8}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  colorScheme="blue" 
                  rounded="xl" 
                  px={8} 
                  leftIcon={<FiSave />}
                  isLoading={isUpdating}
                  loadingText="Saving Changes"
                  boxShadow="0px 4px 12px rgba(66, 153, 225, 0.3)"
                >
                  Save Changes
                </Button>
              </Flex>

            </Stack>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

// --- Reusable Modern Input Wrapper ---
const CustomFormField = ({ label, name, icon, value, onChange, placeholder, type = "text" }) => (
  <FormControl>
    <FormLabel fontSize="xs" fontWeight="extrabold" color="gray.600" ml={1}>
      {label}
    </FormLabel>
    <InputGroup size="lg">
      <InputLeftElement pointerEvents="none">
        <Icon as={icon} color="gray.400" />
      </InputLeftElement>
      <Input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        bg="gray.50"
        border="1px solid"
        borderColor="gray.100"
        rounded="xl"
        fontSize="md"
        _focus={{
          bg: "white",
          borderColor: "blue.400",
          ring: "3px",
          ringColor: "blue.50",
        }}
      />
    </InputGroup>
  </FormControl>
);

export default EditTenant;