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
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCreditCard,
  FiAlertCircle,
  FiChevronRight,
  FiSave,
} from "react-icons/fi";

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

  const [currentUnit, setCurrentUnit] = useState(null);
  const [leaseStartDate, setLeaseStartDate] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await axios.get(`/tenants/${id}`);

        const tenant = res.data;

        setForm({
          name: tenant.user.name,
          email: tenant.user.email,
          phone: tenant.phone || "",
          nationalId: tenant.nationalId || "",
          emergencyContact: tenant.emergencyContact || "",
        });

        setCurrentUnit(tenant.unit || null);
        setLeaseStartDate(
          tenant.leaseStartDate
            ? new Date(tenant.leaseStartDate).toLocaleDateString()
            : null
        );
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load tenant",
          status: "error",
          duration: 3000,
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
    e.preventDefault();
    setIsUpdating(true);

    try {
      await axios.put(`/tenants/${id}`, form);

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
        {/* Breadcrumb */}
        <Breadcrumb
          spacing="8px"
          separator={<FiChevronRight color="gray.500" />}
          mb={4}
        >
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => navigate("/allTenants")}
              color="gray.500"
            >
              Tenants
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink fontWeight="bold">
              {form.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Heading size="lg" fontWeight="800" mb={6}>
          Edit Profile
        </Heading>

        {/* Assigned Unit Section */}
        {currentUnit && (
          <Box
            bg="blue.50"
            p={5}
            rounded="xl"
            mb={8}
            border="1px solid"
            borderColor="blue.100"
          >
            <Text fontWeight="bold" mb={2}>
              Assigned Unit
            </Text>
            <Text fontSize="sm">
              {currentUnit.building} - {currentUnit.unitNumber} (
              {currentUnit.description})
            </Text>

            {leaseStartDate && (
              <Text fontSize="sm" color="gray.600" mt={1}>
                Lease Started: {leaseStartDate}
              </Text>
            )}
          </Box>
        )}

        {/* Edit Card */}
        <Box
          bg="white"
          p={{ base: 6, md: 10 }}
          rounded="3xl"
          shadow="sm"
          border="1px solid"
          borderColor="gray.100"
        >
          <form onSubmit={handleUpdate}>
            <Stack spacing={8}>
              {/* Identity */}
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="blue.500"
                  mb={4}
                  textTransform="uppercase"
                  letterSpacing="widest"
                >
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

              <Divider />

              {/* Contact */}
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="blue.500"
                  mb={4}
                  textTransform="uppercase"
                  letterSpacing="widest"
                >
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
                    label="Emergency Contact"
                    name="emergencyContact"
                    icon={FiAlertCircle}
                    value={form.emergencyContact}
                    onChange={handleChange}
                  />
                </Box>
              </Box>

              {/* Buttons */}
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

const CustomFormField = ({
  label,
  name,
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <FormControl>
    <FormLabel fontSize="xs" fontWeight="bold" color="gray.600">
      {label}
    </FormLabel>
    <InputGroup>
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
        _focus={{
          bg: "white",
          borderColor: "blue.400",
        }}
      />
    </InputGroup>
  </FormControl>
);

export default EditTenant;
