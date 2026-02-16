import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const CreateTenant = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    nationalId: "",
    emergencyContact: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/tenants", form);

      toast({
        title: "Tenant Created",
        description: "New tenant added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
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
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.100">
      <Box
        bg="white"
        p={10}
        rounded="2xl"
        shadow="xl"
        width="100%"
        maxW="500px"
      >
        <Heading mb={6} textAlign="center">
          Add New Tenant 👤
        </Heading>

        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Input
              placeholder="Full Name"
              name="name"
              onChange={handleChange}
            />
            <Input
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <Input
              placeholder="Password"
              type="password"
              name="password"
              onChange={handleChange}
            />
            <Input
              placeholder="Phone"
              name="phone"
              onChange={handleChange}
            />
            <Input
              placeholder="National ID"
              name="nationalId"
              onChange={handleChange}
            />
            <Input
              placeholder="Emergency Contact"
              name="emergencyContact"
              onChange={handleChange}
            />

            <Button type="submit" colorScheme="blue" size="lg">
              Create Tenant
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigate("/allTenants")}
            >
              Cancel
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};

export default CreateTenant;
