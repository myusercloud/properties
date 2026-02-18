import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  HStack,
  Spinner,
  Center,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tag,
  TagLabel,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiMoreVertical,
  FiUserPlus,
  FiFilter,
  FiDownload,
  FiArrowLeft,
  FiUsers,
} from "react-icons/fi";

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/tenants", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTenants(res.data);
      } catch (error) {
        console.error("Failed to fetch tenants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTenants();
  }, []);

  const filteredTenants = tenants.filter((t) =>
    t.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p={{ base: 4, md: 10 }} bg="#F7FAFC" minH="100vh">
      <Flex justify="space-between" align="center" mb={8}>
        <HStack spacing={4}>
          <IconButton
            icon={<FiArrowLeft />}
            aria-label="Go Back"
            variant="ghost"
            bg="white"
            shadow="sm"
            onClick={() => navigate("/caretaker")}
          />

          <Box>
            <Heading size="lg" fontWeight="800" letterSpacing="tight">
              Tenant Directory
            </Heading>
            <Text color="gray.500" fontSize="sm">
              You have {tenants.length} total residents registered.
            </Text>
          </Box>
        </HStack>

        <HStack spacing={3}>
          <Button
            leftIcon={<FiDownload />}
            variant="outline"
            bg="white"
            display={{ base: "none", md: "flex" }}
          >
            Export
          </Button>

          <Button
            leftIcon={<FiUserPlus />}
            colorScheme="blue"
            shadow="0px 4px 12px rgba(66, 153, 225, 0.3)"
            onClick={() => navigate("/create-tenant")}
          >
            Add Tenant
          </Button>
        </HStack>
      </Flex>

      <Stack
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        mb={6}
        spacing={4}
      >
        <InputGroup
          maxW={{ base: "full", md: "400px" }}
          bg="white"
          rounded="xl"
          shadow="sm"
        >
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search by name or email..."
            border="none"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <Button leftIcon={<FiFilter />} variant="ghost" color="gray.600">
          Filters
        </Button>
      </Stack>

      {loading ? (
        <Center h="300px">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Center>
      ) : filteredTenants.length === 0 ? (
        <Center
          h="400px"
          bg="white"
          rounded="2xl"
          border="2px dashed"
          borderColor="gray.200"
          flexDirection="column"
        >
          <Box bg="blue.50" p={4} rounded="full" mb={4}>
            <FiUsers size="40px" color="#3182ce" />
          </Box>
          <Heading size="md" mb={2}>
            No tenants found
          </Heading>
          <Text color="gray.500" mb={6}>
            Try adjusting your search or add a new tenant.
          </Text>
          <Button
            colorScheme="blue"
            variant="outline"
            onClick={() => navigate("/create-tenant")}
          >
            Create New Entry
          </Button>
        </Center>
      ) : (
        <Box
          bg="white"
          rounded="2xl"
          shadow="sm"
          border="1px solid"
          borderColor="gray.100"
          overflowX="auto"
        >
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Profile</Th>
                <Th>Contact Info</Th>
                <Th>Status</Th>
                <Th>Joined Date</Th>
                <Th></Th>
              </Tr>
            </Thead>

            <Tbody>
              {filteredTenants.map((tenant) => {
                const activeLease = tenant.leases?.[0];
                const assignedUnit = activeLease?.unit;

                return (
                  <Tr key={tenant.id} _hover={{ bg: "blue.50/30" }} transition="0.2s">
                    <Td>
                      <HStack spacing={3}>
                        <Avatar size="sm" name={tenant.user?.name} />
                        <Box>
                          <Text fontWeight="bold" fontSize="sm">
                            {tenant.user?.name}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            ID: {tenant.id.slice(0, 8)}
                          </Text>
                        </Box>
                      </HStack>
                    </Td>

                    <Td>
                      <Stack spacing={0}>
                        <Text fontSize="sm" fontWeight="medium">
                          {tenant.user?.email}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {tenant.phone || "No phone"}
                        </Text>
                      </Stack>
                    </Td>

                    <Td>
                      <Tag
                        size="sm"
                        rounded="full"
                        colorScheme={assignedUnit ? "green" : "gray"}
                      >
                        <TagLabel>
                          {assignedUnit
                            ? `Unit ${assignedUnit.unitNumber} (${assignedUnit.building})`
                            : "Unassigned"}
                        </TagLabel>
                      </Tag>
                    </Td>

                    <Td fontSize="sm" color="gray.600">
                      {new Date(tenant.createdAt).toLocaleDateString()}
                    </Td>

                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<FiMoreVertical />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem
                            onClick={() => navigate(`/tenants/${tenant.id}`)}
                          >
                            View Profile
                          </MenuItem>
                          <MenuItem>
                            Edit Lease
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              navigate(`/tenants/${tenant.id}/edit`)
                            }
                          >
                            Update Tenant Info
                          </MenuItem>
                          <MenuItem color="red.500">
                            Remove Tenant
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default Tenants;
