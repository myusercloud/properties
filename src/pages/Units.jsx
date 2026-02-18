import {
  Box,
  Flex,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  IconButton,
  HStack,
  Spinner,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useDisclosure,
  Text,
  Icon,
  Tooltip,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { FiPlus, FiEdit, FiTrash2, FiHome, FiInfo, FiUser, FiActivity } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "../api/axios";

const Units = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUnit, setEditingUnit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [form, setForm] = useState({
    building: "",
    unitNumber: "",
    description: "",
    rentAmount: "",
  });

  const fetchUnits = async () => {
    try {
      const res = await axios.get("/units");
      setUnits(res.data);
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to load inventory details",
        status: "error",
        variant: "subtle",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenCreate = () => {
    setEditingUnit(null);
    setForm({ building: "", unitNumber: "", description: "", rentAmount: "" });
    onOpen();
  };

  const handleEdit = (unit) => {
    setEditingUnit(unit);
    setForm({
      building: unit.building,
      unitNumber: unit.unitNumber,
      description: unit.description,
      rentAmount: unit.rentAmount,
    });
    onOpen();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (editingUnit) {
        await axios.put(`/units/${editingUnit.id}`, form);
        toast({ title: "Unit Updated", status: "success", isClosable: true });
      } else {
        await axios.post("/units", form);
        toast({ title: "Unit Created", status: "success", isClosable: true });
      }
      fetchUnits();
      onClose();
    } catch (error) {
      toast({
        title: "Action Failed",
        description: error.response?.data?.message || "Check your network connection",
        status: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/units/${id}`);
      toast({ title: "Unit removed from inventory", status: "info" });
      fetchUnits();
    } catch (error) {
      toast({ title: "Error", description: "Could not delete unit", status: "error" });
    }
  };

  return (
    <Box p={{ base: 4, md: 10 }} bg="#F9FAFB" minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={10}>
        <Box>
          <Heading size="lg" fontWeight="800" letterSpacing="tight">
            Inventory & Units
          </Heading>
          <Text color="gray.500" fontSize="sm" mt={1}>
            Track occupancy and manage property listings
          </Text>
        </Box>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          rounded="xl"
          px={6}
          shadow="0px 4px 12px rgba(66, 153, 225, 0.3)"
          onClick={handleOpenCreate}
          _hover={{ transform: "translateY(-2px)" }}
        >
          Add Unit
        </Button>
      </Flex>

      {loading ? (
        <Center h="400px">
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        </Center>
      ) : (
        <Box bg="white" rounded="2xl" shadow="sm" border="1px solid" borderColor="gray.100" overflowX="auto">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th color="gray.400" textTransform="none">Building / Unit</Th>
                <Th color="gray.400" textTransform="none">Description</Th>
                <Th color="gray.400" textTransform="none">Monthly Rent</Th>
                <Th color="gray.400" textTransform="none">Status</Th>
                <Th color="gray.400" textTransform="none">Tenant</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {units.map((unit) => (
                <Tr key={unit.id} _hover={{ bg: "gray.50/50" }}>
                  <Td>
                    <HStack spacing={3}>
                      <Center p={2} bg="blue.50" rounded="lg">
                        <Icon as={FiHome} color="blue.500" />
                      </Center>
                      <Box>
                        <Text fontWeight="bold" color="gray.700">{unit.building}</Text>
                        <Text fontSize="xs" color="gray.500">Suite {unit.unitNumber}</Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td maxW="250px">
                    <Text fontSize="sm" isTruncated color="gray.600">{unit.description}</Text>
                  </Td>
                  <Td>
                    <Text fontWeight="extrabold" fontSize="sm">
                      KES {Number(unit.rentAmount).toLocaleString()}
                    </Text>
                  </Td>
                  <Td>
                    <Badge
                      rounded="full"
                      px={3}
                      py={0.5}
                      fontSize="xs"
                      colorScheme={unit.status === "AVAILABLE" ? "green" : "red"}
                      variant="subtle"
                    >
                      {unit.status}
                    </Badge>
                  </Td>
                  <Td>
                    {unit.leases && unit.leases.length > 0 ? (
                        <HStack>
                            < Icon as={FiUser} color="gray.400" />
                            <Text fontSize="sm" fontWeight="medium">{unit.leases[0].tenant.user.name}</Text>
                        </HStack>
                    ) : (
                        <Text fontSize="sm" color="gray.500">_</Text>
                    )}
                  </Td>
                  <Td>
                    <HStack spacing={2} justify="flex-end">
                      <Tooltip label="Edit Unit">
                        <IconButton
                          aria-label="Edit"
                          icon={<FiEdit />}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(unit)}
                        />
                      </Tooltip>
                      <Tooltip label="Delete Unit">
                        <IconButton
                          aria-label="Delete"
                          icon={<FiTrash2 />}
                          variant="ghost"
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleDelete(unit.id)}
                        />
                      </Tooltip>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Modern Dialog Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.300" />
        <ModalContent rounded="3xl" p={2}>
          <ModalHeader pt={6}>
            <HStack spacing={3}>
              <Icon as={FiActivity} color="blue.500" />
              <Text fontSize="xl" fontWeight="800">
                {editingUnit ? "Edit Unit Details" : "Register New Unit"}
              </Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton top={6} right={6} />
          
          <ModalBody>
            <Stack spacing={5}>
              <SimpleGrid columns={2} spacing={4}>
                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="bold">Building Name</FormLabel>
                  <Input 
                    name="building" 
                    bg="gray.50" 
                    rounded="xl" 
                    placeholder="e.g. Block A" 
                    value={form.building} 
                    onChange={handleChange} 
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="bold">Unit ID/No.</FormLabel>
                  <Input 
                    name="unitNumber" 
                    bg="gray.50" 
                    rounded="xl" 
                    placeholder="e.g. 104" 
                    value={form.unitNumber} 
                    onChange={handleChange} 
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="bold">Description</FormLabel>
                <Input 
                  name="description" 
                  bg="gray.50" 
                  rounded="xl" 
                  placeholder="e.g. Two bedroom, ocean view" 
                  value={form.description} 
                  onChange={handleChange} 
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="xs" fontWeight="bold">Monthly Rent</FormLabel>
                <InputGroup size="md">
                  <InputLeftAddon roundedLeft="xl">KES</InputLeftAddon>
                  <Input 
                    type="number" 
                    name="rentAmount" 
                    bg="gray.50" 
                    roundedRight="xl" 
                    placeholder="0.00" 
                    value={form.rentAmount} 
                    onChange={handleChange} 
                  />
                </InputGroup>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter pb={6}>
            <Button variant="ghost" mr={3} onClick={onClose} rounded="xl">
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              px={8} 
              rounded="xl" 
              onClick={handleSubmit}
              isLoading={isSubmitting}
            >
              {editingUnit ? "Save Changes" : "Create Listing"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// Internal Grid Import for convenience
const SimpleGrid = (props) => <Box display="grid" {...props} />;

export default Units;