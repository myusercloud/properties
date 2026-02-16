import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
// Optional: Using react-icons for that extra polish
import { FiMail, FiLock } from "react-icons/fi";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === "CARETAKER") navigate("/caretaker");
      else navigate("/tenant");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "subtle", // Modern subtle look for toast
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      // Soft mesh gradient background
      bg="gray.50"
      bgImage="radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)"
      px={4}
    >
      <Box
        p={10}
        rounded="3xl"
        bg="rgba(255, 255, 255, 0.9)"
        backdropFilter="blur(10px)"
        shadow="2xl"
        width="100%"
        maxW="450px"
        border="1px solid"
        borderColor="whiteAlpha.300"
      >
        <Stack spacing={8}>
          <Stack align="center" spacing={2}>
            <Heading fontSize="3xl" fontWeight="extrabold" color="gray.800">
              Welcome Back
            </Heading>
            <Text fontSize="md" color="gray.600">
              Enter your credentials to continue
            </Text>
          </Stack>

          <form onSubmit={handleLogin}>
            <Stack spacing={5}>
              <FormControl id="email" isRequired>
                <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Email Address</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiMail} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    bg="gray.50"
                    border="none"
                    _focus={{ bg: "white", ring: 2, ringColor: "blue.400" }}
                    size="lg"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Password</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiLock} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    bg="gray.50"
                    border="none"
                    _focus={{ bg: "white", ring: 2, ringColor: "blue.400" }}
                    size="lg"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                fontSize="md"
                width="full"
                isLoading={isLoading}
                loadingText="Verifying..."
                boxShadow="0px 4px 14px 0px rgba(66, 153, 225, 0.39)"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
              >
                Sign In
              </Button>
            </Stack>
          </form>

          <Text textAlign="center" fontSize="sm" color="gray.500">
            Don't have an account? <Text as="span" color="blue.500" cursor="pointer" fontWeight="bold">Register</Text>
          </Text>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Login;