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
} from "@chakra-ui/react";

import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "../api/axios";

const Units = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUnit, setEditingUnit] = useState(null);

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
        title: "Error",
        description: "Failed to load units",
        status: "error",
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
    setForm({
      building: "",
      unitNumber: "",
      description: "",
      rentAmount: "",
    });
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
    try {
      if (editingUnit) {
        await axios.put(`/units/${editingUnit.id}`, form);
        toast({ title: "Unit updated", status: "success" });
      } else {
        await axios.post("/units", form);
        toast({ title: "Unit created", status: "success" });
      }

      fetchUnits();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Action failed",
        status: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this unit?")) return;

    try {
      await axios.delete(`/units/${id}`);
      toast({ title: "Unit deleted", status: "success" });
      fetchUnits();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message,
        status: "error",
      });
    }
  };

  return (
    <Box p={10} bg="gray.50" minH="100vh">
      <Flex justify="space-between" mb={6}>
        <Heading size="lg">Units Management</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={handleOpenCreate}>
          Add Unit
        </Button>
      </Flex>

      {loading ? (
        <Center h="300px">
          <Spinner size="xl" />
        </Center>
      ) : (
        <Box bg="white" rounded="xl" shadow="sm">
          <Table>
            <Thead>
              <Tr>
                <Th>Building</Th>
                <Th>Unit</Th>
                <Th>Description</Th>
                <Th>Rent</Th>
                <Th>Status</Th>
                <Th>Tenant</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {units.map((unit) => (
                <Tr key={unit.id}>
                  <Td>{unit.building}</Td>
                  <Td>{unit.unitNumber}</Td>
                  <Td>{unit.description}</Td>
                  <Td>KES {unit.rentAmount}</Td>
                  <Td>
                    <Badge colorScheme={unit.status === "AVAILABLE" ? "green" : "red"}>
                      {unit.status}
                    </Badge>
                  </Td>
                  <Td>
                    {unit.tenant ? unit.tenant.user.name : "—"}
                  </Td>
                  <Td>
                    <HStack>
                      <IconButton
                        icon={<FiEdit />}
                        size="sm"
                        onClick={() => handleEdit(unit)}
                      />
                      <IconButton
                        icon={<FiTrash2 />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(unit.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingUnit ? "Edit Unit" : "Create Unit"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Building</FormLabel>
                <Input name="building" value={form.building} onChange={handleChange} />
              </FormControl>

              <FormControl>
                <FormLabel>Unit Number</FormLabel>
                <Input name="unitNumber" value={form.unitNumber} onChange={handleChange} />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input name="description" value={form.description} onChange={handleChange} />
              </FormControl>

              <FormControl>
                <FormLabel>Rent Amount</FormLabel>
                <Input type="number" name="rentAmount" value={form.rentAmount} onChange={handleChange} />
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3}>Cancel</Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {editingUnit ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Units;
