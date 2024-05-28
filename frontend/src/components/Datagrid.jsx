// src/components/Datagrid.jsx
import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

const Datagrid = ({ data, type }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg='#191827'
      color="white"
      p={4}
    >
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th color="white">#</Th>
            <Th color="white">{type === "songs" ? "Song Title" : "Artist Name"}</Th>
            {type === "songs" && <Th color="white">Album</Th>}
            {type === "songs" && <Th color="white">Length</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => (
            <Tr key={index} borderBottom="1px" borderColor="black">
              <Td>
                <Box
                  bg="black"
                  p={2}
                  borderRadius="md"
                  textAlign="center"
                >
                  {index + 1}
                </Box>
              </Td>
              <Td>
                <Box
                  bg="black"
                  p={2}
                  borderRadius="md"
                  textAlign="center"
                >
                  {type === "songs" ? item.song : item.artist}
                </Box>
              </Td>
              {type === "songs" && (
                <Td>
                  <Box
                    bg="black"
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
                    bg="black"
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

export default Datagrid;
