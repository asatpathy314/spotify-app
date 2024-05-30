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
  TableContainer,
  useBreakpointValue
} from "@chakra-ui/react";

const truncate = (str, n) => {
  if (str.length <= n) return str; // Nothing to do
  if (n <= 1) return "…"; // Well... not much else we can return here!
  let dot = str.lastIndexOf("."); // Where the extension starts
  // How many characters from the end should remain:
  let after = dot < 0 ? 1 : Math.max(1, Math.min(n - 2, str.length - dot + 2));
  // How many characters from the start should remain:
  let before = n - after - 1; // Account for the ellipsis
  return str.slice(0, before) + "…";
}


const DataGrid = ({ data, type }) => {
  // Determine if the screen size is small
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg='#0f0e17'
      color="#FFFFFE"
    >
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th color="#FFFFFE">#</Th>
              {type === "songs" && !isMobile && <Th color="#FFFFFE">Song Title</Th>}
              <Th color="#FFFFFE">Artist Name</Th>
              {type === "songs" && !isMobile && <Th color="#FFFFFE">Album</Th>}
              {type === "songs" && !isMobile && <Th color="#FFFFFE" textAlign={'center'}><TimeIcon /></Th>}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item, index) => (
              <Tr key={index} borderBottom="1px" borderColor="#0f0e17">
                <Td>
                  <Box
                    bg="#0f0e17"
                    borderRadius="md"
                    textAlign="left"
                  >
                    {index + 1}
                  </Box>
                </Td>
                {type === "songs" && !isMobile && (
                  <Td>
                    <Box
                      bg="#0f0e17"
                      borderRadius="md"
                      textAlign="left"
                    >
                      {truncate(item.song, 46)}
                    </Box>
                  </Td>
                )}
                <Td>
                  <Box
                    bg="#0f0e17"
                    borderRadius="md"
                    textAlign="left"
                  >
                    {item.artist}
                  </Box>
                </Td>
                {type === "songs" && !isMobile && (
                  <Td>
                    <Box
                      bg="#0f0e17"
                      borderRadius="md"
                      textAlign="left"
                    >
                      {truncate(item.album, 46)}
                    </Box>
                  </Td>
                )}
                {type === "songs" && !isMobile && (
                  <Td>
                    <Box
                      bg="#0f0e17"
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
      </TableContainer>
    </Box>
  );
};

export default DataGrid;
