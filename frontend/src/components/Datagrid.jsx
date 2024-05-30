import React from "react";
import { TimeIcon } from '@chakra-ui/icons';
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
      color="#FFFFFE"
      p={4}
    >
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th color="#FFFFFE">#</Th>
            {type === "songs" && <Th color="#FFFFFE">Song Title</Th>}
            <Th color="#FFFFFE">Artist Name</Th>
            {type === "songs" && <Th color="#FFFFFE">Album</Th>}
            {type === "songs" && <Th color="#FFFFFE"><TimeIcon /></Th>}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => (
            <Tr key={index} borderBottom="1px" borderColor="#0f0e17">
              <Td>
                <Box
                  bg="#0f0e17"
                  p={2}
                  borderRadius="md"
                  textAlign="center"
                >
                  {index + 1}
                </Box>
              </Td>
              {type === "songs" && (
                <Td>
                  <Box
                    bg="#0f0e17"
                    p={2}
                    borderRadius="md"
                    textAlign="center"
                  >
                    {item.song}
                  </Box>
                </Td>
              )}
              <Td>
                <Box
                  bg="#0f0e17"
                  p={2}
                  borderRadius="md"
                  textAlign="center"
                >
                  {item.artist}
                </Box>
              </Td>
              {type === "songs" && (
                <Td>
                  <Box
                    bg="#0f0e17"
                    p={2}
                    borderRadius="md"
                    textAlign="center"
                  >
                    {item.album}
                  </Box>
                </Td>
              )}
              {type === "songs" && (
                <Td>
                  <Box
                    bg="#0f0e17"
                    p={2}
                    borderRadius="md"
                    textAlign="center"
                  >
                    {item.length}
                  </Box>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default DataGrid;
