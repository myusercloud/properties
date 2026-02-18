import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  SimpleGrid,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Icon,
  Divider,
  Select,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiCreditCard,
  FiAlertCircle,
  FiArrowLeft,
  FiDollarSign,
} from "react-icons/fi";

const CreateTenant = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [units, setUnits] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    nationalId: "",
    emergencyContact: "",
    unitId: "",
    leaseStartDate: "",
  });

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await axios.get("/units/available");
        setUnits(res.data);
      } catch (error) {
        console.error("Failed to fetch units", error);
      }
    };
    fetchUnits();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/caretaker/onboard-tenant",
        {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          nationalId: form.nationalId,
          emergencyContact: form.emergencyContact,
          unitId: form.unitId,
          startDate: form.leaseStartDate,
          depositAmount: form.depositAmount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: "Tenant Created",
        description: "The tenant has been successfully onboarded.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/allTenants");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create tenant",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Flex minH="100vh" align="center" justify="center" bg="#F7FAFC" py={12}>
      <Box bg="white" p={10} rounded="3xl" shadow="2xl" maxW="700px" w="100%">
        <Button
          variant="ghost"
          leftIcon={<FiArrowLeft />}
          mb={6}
          onClick={() => navigate("/allTenants")}
        >
          Back to list
        </Button>

        <Heading size="lg" mb={2}>
          Onboard New Tenant
        </Heading>
        <Text color="gray.500" mb={6}>
          Fill details and assign available unit.
        </Text>

        <form onSubmit={handleSubmit}>
          <Stack spacing={6}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <CustomInput label="Full Name" name="name" icon={FiUser} onChange={handleChange} />
              <CustomInput label="Email" name="email" icon={FiMail} type="email" onChange={handleChange} />
              <CustomInput label="Password" name="password" icon={FiLock} type="password" onChange={handleChange} />
              <CustomInput label="Phone" name="phone" icon={FiPhone} onChange={handleChange} />
              <CustomInput label="National ID" name="nationalId" icon={FiCreditCard} onChange={handleChange} />
              <CustomInput label="Emergency Contact" name="emergencyContact" icon={FiAlertCircle} onChange={handleChange} />
              <CustomInput label="Deposit Amount" name="depositAmount" icon={FiDollarSign} onChange={handleChange} />
            </SimpleGrid>

            <Divider />

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Assign Unit</FormLabel>
                <Select
                  name="unitId"
                  placeholder="Select available unit"
                  value={form.unitId}
                  onChange={handleChange}
                >
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.building} - {unit.unitNumber} ({unit.description})
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">Lease Start Date</FormLabel>
                <Input
                  type="date"
                  name="leaseStartDate"
                  value={form.leaseStartDate}
                  onChange={handleChange}
                />
              </FormControl>
            </SimpleGrid>

            <Button type="submit" colorScheme="blue" size="lg" isLoading={isLoading}>
              Create Tenant
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};

const CustomInput = ({ label, name, icon, type = "text", onChange }) => (
  <FormControl isRequired>
    <FormLabel fontSize="sm">{label}</FormLabel>
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <Icon as={icon} color="gray.400" />
      </InputLeftElement>
      <Input name={name} type={type} onChange={onChange} />
    </InputGroup>
  </FormControl>
);

export default CreateTenant;
