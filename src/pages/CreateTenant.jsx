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
import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  FiUser, FiMail, FiLock, FiPhone, 
  FiCreditCard, FiAlertCircle, FiArrowLeft 
} from "react-icons/fi";

const CreateTenant = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post("/tenants", form);
      toast({
        title: "Success",
        description: "New tenant onboarded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "subtle"
      });
      navigate("/allTenants");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="#F7FAFC" py={12} px={4}>
      <Box
        bg="white"
        p={{ base: 6, md: 10 }}
        rounded="3xl"
        shadow="2xl"
        width="100%"
        maxW="700px" // Slightly wider for grid layout
      >
        <Button 
          variant="ghost" 
          leftIcon={<FiArrowLeft />} 
          mb={6} 
          onClick={() => navigate("/allTenants")}
          size="sm"
          color="gray.500"
        >
          Back to list
        </Button>

        <Stack spacing={2} mb={8}>
          <Heading size="lg" fontWeight="800">Onboard New Tenant</Heading>
          <Text color="gray.500">Fill in the primary details to create a new lease profile.</Text>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Stack spacing={6}>
            
            {/* --- Section: Personal Info --- */}
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="blue.500" mb={4} textTransform="uppercase" letterSpacing="widest">
                Account Credentials
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <CustomInput 
                  label="Full Name" 
                  name="name" 
                  icon={FiUser} 
                  placeholder="John Doe" 
                  onChange={handleChange} 
                />
                <CustomInput 
                  label="Email Address" 
                  name="email" 
                  icon={FiMail} 
                  type="email" 
                  placeholder="john@example.com" 
                  onChange={handleChange} 
                />
                <CustomInput 
                  label="Temporary Password" 
                  name="password" 
                  icon={FiLock} 
                  type="password" 
                  placeholder="••••••••" 
                  onChange={handleChange} 
                />
              </SimpleGrid>
            </Box>

            <Divider />

            {/* --- Section: Verification & Contact --- */}
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="blue.500" mb={4} textTransform="uppercase" letterSpacing="widest">
                Identity & Emergency
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <CustomInput 
                  label="Phone Number" 
                  name="phone" 
                  icon={FiPhone} 
                  placeholder="+254..." 
                  onChange={handleChange} 
                />
                <CustomInput 
                  label="National ID / Passport" 
                  name="nationalId" 
                  icon={FiCreditCard} 
                  placeholder="12345678" 
                  onChange={handleChange} 
                />
                <CustomInput 
                  label="Emergency Contact" 
                  name="emergencyContact" 
                  icon={FiAlertCircle} 
                  placeholder="Name & Number" 
                  onChange={handleChange} 
                />
              </SimpleGrid>
            </Box>

            <Stack spacing={4} pt={4}>
              <Button 
                type="submit" 
                colorScheme="blue" 
                size="lg" 
                rounded="xl"
                isLoading={isLoading}
                loadingText="Creating account..."
                boxShadow="0px 10px 20px -5px rgba(66, 153, 225, 0.4)"
                _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
              >
                Onboard Tenant
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};

// --- Reusable Modern Input Component ---
const CustomInput = ({ label, name, icon, type = "text", placeholder, onChange }) => (
  <FormControl isRequired>
    <FormLabel fontSize="xs" fontWeight="bold" color="gray.600" ml={1}>
      {label}
    </FormLabel>
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <Icon as={icon} color="gray.400" />
      </InputLeftElement>
      <Input
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        bg="gray.50"
        border="1px solid"
        borderColor="gray.100"
        rounded="xl"
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

export default CreateTenant;