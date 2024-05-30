import React from "react";
import { ButtonGroup, Button, useBreakpointValue } from "@chakra-ui/react";

const TimeButton = ({ currentTimeframe, setTimeframe }) => {
  // Determine the direction of the ButtonGroup based on screen size
  const buttonGroupDirection = useBreakpointValue({ base: 'column', md: 'row' });

  return (
    <ButtonGroup
      isAttached
      variant="outline"
      ml='auto'
      flexDirection={buttonGroupDirection}
    >
      <Button
        colorScheme={currentTimeframe === 'short_term' ? 'orange' : 'gray'}
        backgroundColor={currentTimeframe === 'short_term' ? 'orange' : 'transparent'}
        color={currentTimeframe === 'short_term' ? 'white' : 'white'}
        onClick={() => setTimeframe('short_term')}
        _hover={{ bg: currentTimeframe === 'short_term' ? 'orange' : 'gray' }}
      >
        Last Month
      </Button>
      <Button
        colorScheme={currentTimeframe === 'medium_term' ? 'orange' : 'gray'}
        backgroundColor={currentTimeframe === 'medium_term' ? 'orange.400' : 'transparent'}
        color={currentTimeframe === 'medium_term' ? 'white' : 'white'}
        onClick={() => setTimeframe('medium_term')}
        _hover={{ bg: currentTimeframe === 'medium_term' ? 'orange' : 'gray' }}
      >
        Last 6 Months
      </Button>
      <Button
        colorScheme={currentTimeframe === 'long_term' ? 'orange' : 'gray'}
        backgroundColor={currentTimeframe === 'long_term' ? 'orange.400' : 'transparent'}
        color={currentTimeframe === 'long_term' ? 'white' : 'white'}
        onClick={() => setTimeframe('long_term')}
        _hover={{ bg: currentTimeframe === 'long_term' ? 'orange' : 'gray' }}
      >
        All Time
      </Button>
    </ButtonGroup>
  );
};

export default TimeButton;
