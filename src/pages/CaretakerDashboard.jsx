import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  IconButton,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Progress,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  FiSearch,
  FiHome,
  FiUsers,
  FiSettings,
  FiBell,
  FiMoreVertical,
  FiPlus,
  FiActivity,
  FiCreditCard,
  FiGrid,
} from "react-icons/fi";

import { useNavigate, useLocation } from "react-router-dom";



const Dashboard = () => {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/units/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const estimatedRevenue =
    stats?.buildingCapacity?.reduce(
      (acc, b) => acc + b.occupied * (b.total > 0 ? 1 : 0),
      0
    ) || 0;

  return (
    <Flex minH="100vh" bg="#F7FAFC">
      {/* Sidebar */}
      <Box
        w={{ base: "full", md: "260px" }}
        pos="fixed"
        h="full"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.100"
        display={{ base: "none", md: "block" }}
        p={6}
        boxShadow="sm"
      >
        {/* Logo */}
        <HStack mb={10} spacing={3}>
          <Box bg="blue.600" p={2} rounded="lg">
            <Icon as={FiActivity} color="white" />
          </Box>
          <Heading size="sm" color="gray.800">
            ESTATE CLOUD
          </Heading>
        </HStack>

        {/* Navigation */}
        <Stack spacing={1}>
          <Text
            fontSize="xs"
            fontWeight="bold"
            color="gray.400"
            mb={2}
            px={3}
          >
            MAIN MENU
          </Text>

          <NavItem
            icon={FiHome}
            to="/caretaker"
            active={location.pathname === "/caretaker"}
          >
            Overview
          </NavItem>

          <NavItem
            icon={FiUsers}
            to="/allTenants"
            active={location.pathname === "/tenants"}
          >
            Tenants
          </NavItem>
          <NavItem
            icon={FiGrid}
            to="/units"
            active={location.pathname === "/units"}
          >
            Units
          </NavItem>

          <NavItem icon={FiCreditCard}>Payments</NavItem>
          <NavItem icon={FiBell}>Notifications</NavItem>
          <NavItem icon={FiSettings}>Settings</NavItem>
        </Stack>
      </Box>

      {/* Main Content */}
      <Box ml={{ base: 0, md: "260px" }} p={{ base: 4, md: 10 }} w="full">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={10}>
          <Box>
            <Heading size="lg" fontWeight="800" color="gray.800">
              Analytics Dashboard
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Monitor your property performance
            </Text>
          </Box>

          <HStack spacing={4}>
            <InputGroup
              display={{ base: "none", lg: "flex" }}
              w="350px"
            >
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search everything..."
                bg="white"
                border="none"
                shadow="sm"
                _focus={{ shadow: "md" }}
              />
            </InputGroup>

            <IconButton
              icon={<FiBell />}
              variant="ghost"
              bg="white"
              shadow="sm"
              rounded="full"
              aria-label="Notifications"
            />

            <Avatar
              size="sm"
              src="https://bit.ly/dan-abramov"
              border="2px solid white"
              shadow="sm"
            />
          </HStack>
        </Flex>

        {/* Stats */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={10}>
          <StatCard
            label="Monthly Revenue"
            number="$45,280.00"
            help="12.5%"
            type="increase"
            color="blue.500"
          />
          <StatCard
            label="Occupancy Rate"
            number={stats ? `${stats.occupancyRate}%` : "Loading..."}
            help={stats ? `${stats.occupiedUnits} of ${stats.totalUnits} occupied` : ""}
            type="increase"
            color="purple.500"
          />
          <StatCard
            label="Pending Requests"
            number="14"
            help="4 today"
            type="decrease"
            color="orange.400"
          />
        </SimpleGrid>

        {/* Transactions */}
        <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={8}>
          <Box
            gridColumn={{ xl: "span 2" }}
            bg="white"
            rounded="2xl"
            shadow="sm"
            border="1px solid"
            borderColor="gray.100"
            overflow="hidden"
          >
            <Flex p={6} justify="space-between" align="center">
              <Heading size="md" color="gray.700">
                Recent Transactions
              </Heading>
              <Button leftIcon={<FiPlus />}>
                Add New
              </Button>
            </Flex>

            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th fontSize="xs" color="gray.400">
                    Tenant
                  </Th>
                  <Th fontSize="xs" color="gray.400">
                    Status
                  </Th>
                  <Th fontSize="xs" color="gray.400">
                    Amount
                  </Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                <TableRow
                  name="John Doe"
                  email="john@example.com"
                  status="Paid"
                  amount="$1,200"
                />
                <TableRow
                  name="Sarah Connor"
                  email="sarah@sky.net"
                  status="Pending"
                  amount="$950"
                />
                <TableRow
                  name="Mike Ross"
                  email="mike@suits.com"
                  status="Overdue"
                  amount="$2,400"
                />
              </Tbody>
            </Table>
          </Box>

          {/* Capacity Widget */}
          <Box
            bg="white"
            p={6}
            rounded="2xl"
            shadow="sm"
            border="1px solid"
            borderColor="gray.100"
          >
            <Heading size="sm" mb={6} color="gray.700">
              Property Capacity
            </Heading>

            <Stack spacing={5}>
              {stats?.buildingCapacity?.map((building) => (
                <CapacityBar
                  key={building.building}
                  label={`${building.building} (${building.occupied}/${building.total})`}
                  value={building.percentage}
                  color={building.percentage > 80 ? "green" : building.percentage > 50 ? "yellow" : "red"}
                />
              ))}
            </Stack>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

//
// Sidebar Item
//
const NavItem = ({ icon, children, active, to }) => {
  const navigate = useNavigate();

  return (
    <HStack
      p={3}
      px={4}
      cursor="pointer"
      rounded="xl"
      bg={active ? "blue.500" : "transparent"}
      color={active ? "white" : "gray.500"}
      _hover={!active ? { bg: "gray.50", color: "blue.500" } : {}}
      transition="all 0.2s"
      onClick={() => to && navigate(to)}
    >
      <Icon as={icon} fontSize="lg" />
      <Text fontSize="sm" fontWeight={active ? "bold" : "medium"}>
        {children}
      </Text>
    </HStack>
  );
};

//
// Stat Card
//
const StatCard = ({ label, number, help, type, color }) => (
  <Box
    p={6}
    bg="white"
    rounded="2xl"
    shadow="sm"
    borderLeft="4px solid"
    borderColor={color}
  >
    <Stat>
      <StatLabel fontSize="xs" textTransform="uppercase">
        {label}
      </StatLabel>
      <StatNumber fontSize="3xl" fontWeight="800">
        {number}
      </StatNumber>
      <StatHelpText>
        <StatArrow type={type} />
        {help}
      </StatHelpText>
    </Stat>
  </Box>
);

//
// Table Row
//
const TableRow = ({ name, email, status, amount }) => {
  const statusColors = {
    Paid: "green",
    Pending: "orange",
    Overdue: "red",
  };

  return (
    <Tr _hover={{ bg: "gray.50" }}>
      <Td>
        <HStack>
          <Avatar size="sm" name={name} />
          <Box>
            <Text fontWeight="bold" fontSize="sm">
              {name}
            </Text>
            <Text fontSize="xs" color="gray.400">
              {email}
            </Text>
          </Box>
        </HStack>
      </Td>

      <Td>
        <Badge colorScheme={statusColors[status]}>
          {status}
        </Badge>
      </Td>

      <Td fontWeight="bold">{amount}</Td>

      <Td>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FiMoreVertical />}
            variant="ghost"
            size="sm"
          />
          <MenuList>
            <MenuItem>Edit</MenuItem>
            <MenuItem>Download</MenuItem>
            <MenuItem color="red.500">
              Flag
            </MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
};

//
// Capacity Bar
//
const CapacityBar = ({ label, value, color }) => (
  <Box>
    <Flex justify="space-between" mb={2}>
      <Text fontSize="sm" fontWeight="bold">
        {label}
      </Text>
      <Text fontSize="sm" color="gray.500">
        {value}%
      </Text>
    </Flex>
    <Progress
      value={value}
      size="xs"
      colorScheme={color}
      rounded="full"
    />
  </Box>
);

//
// Simple Button
//
const Button = ({ children, leftIcon, ...props }) => (
  <Box
    as="button"
    px={4}
    py={2}
    bg="blue.500"
    color="white"
    rounded="lg"
    display="flex"
    alignItems="center"
    gap={2}
    fontSize="sm"
    fontWeight="bold"
    _hover={{ bg: "blue.600" }}
    {...props}
  >
    {leftIcon}
    {children}
  </Box>
);

export default Dashboard;
