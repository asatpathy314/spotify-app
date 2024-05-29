import React from "react";
import { ButtonGroup, Button } from "@chakra-ui/react";

const TimeButton = ({ currentTimeframe, setTimeframe }) => {
  return (
    <ButtonGroup variant="outline" spacing="6">
      <Button 
        colorScheme={currentTimeframe === 'short_term' ? 'orange' : 'white'}
        onClick={() => setTimeframe('short_term')}
      >
        Short Term
      </Button>
      <Button 
        colorScheme={currentTimeframe === 'medium_term' ? 'orange' : 'white'}
        onClick={() => setTimeframe('medium_term')}
      >
        Medium Term
      </Button>
      <Button 
        colorScheme={currentTimeframe === 'long_term' ? 'orange' : 'white'}
        onClick={() => setTimeframe('long_term')}
      >
        Long Term
      </Button>
    </ButtonGroup>
  );
};

export default TimeButton;
