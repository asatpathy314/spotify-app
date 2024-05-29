// src/components/Datagrid.jsx
import React from "react";
import { TimeIcon } from '@chakra-ui/icons'
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

const DataGrid = ({ data, type }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg='#0f0e17'
      color="white"
      p={4}
    >
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th color="white">#</Th>
            <Th color="white">Song Title</Th>
            <Th color="white">Artist Name</Th>
            <Th color="white">Album</Th>
            <Th color="white"><TimeIcon /></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => (
            <Tr key={index} borderBottom="1px" borderColor="black">
              <Td>
                <Box
                  p={2}
                  borderRadius="md"
                  textAlign="center"
                >
                  {index + 1}
                </Box>
              </Td>
              <Td>
                <Box
                  p={2}
                  borderRadius="md"
                  textAlign="center"
                >
                  {item.song}
                </Box>
              </Td>
              <Td>
                <Box
                  p={2}
                  borderRadius="md"
                  textAlign="center"
                >
                  {item.artist}
                </Box>
              </Td>
              <Td>
                <Box
                  p={2}
                  borderRadius="md"
                  textAlign="center"
                >
                  {item.album}
                </Box>
              </Td>
              <Td>
                <Box
                  p={2}
                  borderRadius="md"
                  textAlign="center"
                >
                  {item.length}
                </Box>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default DataGrid;