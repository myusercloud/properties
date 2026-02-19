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
  Tooltip,
  Divider,
  Center
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
  FiTrendingUp,
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
          headers: { Authorization: `Bearer ${token}` },
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

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

  return (
    <Flex minH="100vh" bg="#F8FAFC">
      {/* Sidebar (Reusable) */}
      <Box w={{ base: "full", md: "260px" }} pos="fixed" h="full" bg="white" borderRight="1px solid" borderColor="gray.100" display={{ base: "none", md: "block" }} p={6}>
        <HStack mb={10} spacing={3}>
          <Center bg="blue.600" p={2} rounded="xl" shadow="0px 4px 12px rgba(49, 130, 206, 0.4)">
            <Icon as={FiActivity} color="white" />
          </Center>
          <Heading size="sm" color="gray.800" letterSpacing="tight">ESTATE CLOUD</Heading>
        </HStack>

        <Stack spacing={1}>
          <Text fontSize="10px" fontWeight="black" color="gray.400" mb={2} px={3} letterSpacing="widest">ADMINISTRATION</Text>
          <NavItem icon={FiHome} to="/caretaker" active={location.pathname === "/caretaker"}>Overview</NavItem>
          <NavItem icon={FiUsers} to="/allTenants" active={location.pathname === "/allTenants"}>Tenants</NavItem>
          <NavItem icon={FiGrid} to="/units" active={location.pathname === "/units"}>Units</NavItem>
          <NavItem icon={FiCreditCard}>Payments</NavItem>
          <NavItem icon={FiSettings}>Settings</NavItem>
        </Stack>
      </Box>

      {/* Main Content */}
      <Box ml={{ base: 0, md: "260px" }} p={{ base: 4, md: 10 }} w="full">
        {/* Modern Header */}
        <Flex justify="space-between" align="center" mb={10}>
          <Box>
            <Heading size="lg" fontWeight="800" color="gray.800" letterSpacing="tight">Executive Overview</Heading>
            <Text color="gray.500" fontSize="sm">Real-time property performance metrics.</Text>
          </Box>

          <HStack spacing={4}>
            <InputGroup display={{ base: "none", lg: "flex" }} w="300px">
              <InputLeftElement pointerEvents="none"><FiSearch color="gray.400" /></InputLeftElement>
              <Input placeholder="Search units..." bg="white" border="none" shadow="sm" rounded="xl" />
            </InputGroup>
            <IconButton icon={<FiBell />} variant="ghost" bg="white" shadow="sm" rounded="xl" aria-label="Notifications" />
            <Avatar size="sm" rounded="lg" shadow="sm" name="Admin User" />
          </HStack>
        </Flex>

        {/* High-Level Stats */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={10}>
          <StatCard 
            label="Est. Monthly Revenue" 
            number={formatCurrency(452800)} 
            help="v.s. last month" 
            type="increase" 
            pct="12%" 
            icon={FiTrendingUp} 
            color="blue.500" 
          />
          <StatCard 
            label="Occupancy Rate" 
            number={stats ? `${stats.occupancyRate}%` : "0%"} 
            help={`${stats?.occupiedUnits || 0} of ${stats?.totalUnits || 0} filled`} 
            type={stats?.occupancyRate > 80 ? "increase" : "decrease"} 
            pct={stats?.occupancyRate > 80 ? "Healthy" : "Low"} 
            icon={FiHome} 
            color="purple.500" 
          />
          <StatCard 
            label="Collection Status" 
            number="92.4%" 
            help="7 tenants pending" 
            type="decrease" 
            pct="2.1%" 
            icon={FiCreditCard} 
            color="orange.400" 
          />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={8}>
          {/* Recent Activity Table */}
          <Box gridColumn={{ xl: "span 2" }} bg="white" rounded="3xl" shadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">
            <Flex p={6} justify="space-between" align="center">
              <Box>
                <Heading size="md" color="gray.700">Recent Transactions</Heading>
                <Text fontSize="xs" color="gray.400">Latest rent and utility payments</Text>
              </Box>
              <Button leftIcon={<FiPlus />} size="sm">Log Payment</Button>
            </Flex>

            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th color="gray.400">Resident</Th>
                  <Th color="gray.400">Status</Th>
                  <Th color="gray.400">Amount</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                <TableRow name="John Doe" email="Block A - Unit 104" status="Paid" amount="KES 45,000" />
                <TableRow name="Sarah Connor" email="Block B - Unit 201" status="Pending" amount="KES 32,500" />
                <TableRow name="Mike Ross" email="Block A - Unit 302" status="Overdue" amount="KES 55,000" />
              </Tbody>
            </Table>
          </Box>

          {/* Building Portfolio Capacity */}
          <Box bg="white" p={6} rounded="3xl" shadow="sm" border="1px solid" borderColor="gray.100">
            <Flex justify="space-between" align="center" mb={6}>
              <Box>
                <Heading size="sm" color="gray.700">Property Capacity</Heading>
                <Text fontSize="xs" color="gray.400">Occupancy by block</Text>
              </Box>
              <Icon as={FiGrid} color="gray.300" />
            </Flex>

            <Stack spacing={6}>
              {stats?.buildingCapacity?.map((building) => (
                <EnhancedCapacityBar
                  key={building.building}
                  label={building.building}
                  percentage={building.percentage}
                  occupied={building.occupied}
                  total={building.total}
                />
              ))}
            </Stack>

            <Divider my={6} />
            <HStack justify="space-between">
              <Text fontSize="xs" color="gray.400" fontWeight="bold">Portfolio Health</Text>
              <Badge colorScheme="green" rounded="full" px={2}>Optimal</Badge>
            </HStack>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

// --- MODERN SUB-COMPONENTS ---

const NavItem = ({ icon, children, active, to }) => {
  const navigate = useNavigate();
  return (
    <HStack p={3} px={4} cursor="pointer" rounded="xl" bg={active ? "blue.500" : "transparent"} color={active ? "white" : "gray.500"}
      _hover={!active ? { bg: "gray.50", color: "blue.500" } : {}} transition="all 0.2s" onClick={() => to && navigate(to)}>
      <Icon as={icon} fontSize="lg" />
      <Text fontSize="sm" fontWeight={active ? "bold" : "medium"}>{children}</Text>
    </HStack>
  );
};

//

const StatCard = ({ label, number, help, type, pct, color, icon }) => (
  <Box
    p={6}
    bg="white"
    rounded="3xl"
    shadow="sm"
    border="1px solid"
    borderColor="gray.100"
  >
    <Stat>
      <HStack justify="space-between" align="start">
        <Box>
          <StatLabel
            fontSize="xs"
            fontWeight="bold"
            color="gray.400"
            textTransform="uppercase"
            mb={2}
          >
            {label}
          </StatLabel>

          <StatNumber
            fontSize="2xl"
            fontWeight="900"
            color="gray.800"
          >
            {number}
          </StatNumber>

          <StatHelpText>
            <StatArrow type={type} />
            <Text
              as="span"
              fontWeight="bold"
              color={type === "increase" ? "green.500" : "red.500"}
              mr={2}
            >
              {pct}
            </Text>
            <Text as="span" color="gray.400">
              {help}
            </Text>
          </StatHelpText>
        </Box>

        <Center bg="gray.50" p={3} rounded="xl">
          <Icon as={icon} color={color} boxSize={5} />
        </Center>
      </HStack>
    </Stat>
  </Box>
);


const EnhancedCapacityBar = ({ label, percentage, occupied, total }) => {
  const color = percentage > 80 ? "green" : percentage > 50 ? "blue" : "red";
  return (
    <Box>
      <Flex justify="space-between" align="end" mb={2}>
        <Box>
          <Text fontSize="sm" fontWeight="bold" color="gray.700">{label}</Text>
          <Text fontSize="10px" color="gray.400" fontWeight="black">{occupied} / {total} UNITS FILLED</Text>
        </Box>
        <Text fontSize="sm" fontWeight="black" color={`${color}.500`}>{percentage}%</Text>
      </Flex>
      <Tooltip label={`${occupied} Units Occupied`}>
        <Progress value={percentage} size="xs" colorScheme={color} rounded="full" bg="gray.100" />
      </Tooltip>
    </Box>
  );
};

const TableRow = ({ name, email, status, amount }) => (
  <Tr _hover={{ bg: "gray.50/50" }} transition="0.2s">
    <Td border="none">
      <HStack spacing={3}>
        <Avatar size="sm" rounded="lg" name={name} />
        <Box>
          <Text fontWeight="bold" fontSize="sm" color="gray.800">{name}</Text>
          <Text fontSize="xs" color="gray.400">{email}</Text>
        </Box>
      </HStack>
    </Td>
    <Td border="none">
      <Badge colorScheme={status === "Paid" ? "green" : status === "Pending" ? "orange" : "red"} variant="subtle" rounded="full" px={3}>
        {status}
      </Badge>
    </Td>
    <Td border="none" fontWeight="black" fontSize="sm">{amount}</Td>
    <Td border="none">
      <Menu>
        <MenuButton as={IconButton} icon={<FiMoreVertical />} variant="ghost" size="sm" rounded="lg" />
        <MenuList rounded="xl" shadow="xl" border="none">
          <MenuItem fontSize="sm">View Receipt</MenuItem>
          <MenuItem fontSize="sm" color="red.500">Flag Transaction</MenuItem>
        </MenuList>
      </Menu>
    </Td>
  </Tr>
);

const Button = ({ children, leftIcon, ...props }) => (
  <Box as="button" px={4} py={2} bg="blue.500" color="white" rounded="xl" display="flex" alignItems="center" gap={2} fontSize="xs" fontWeight="bold"
    _hover={{ bg: "blue.600", transform: "translateY(-1px)" }} transition="0.2s" shadow="0px 4px 12px rgba(49, 130, 206, 0.3)" {...props}>
    {leftIcon} {children}
  </Box>
);

export default Dashboard;