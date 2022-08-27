import { Button, Container, Grid, Step, StepButton, Stepper, Typography } from '@mui/material';
import React from 'react';
import { useState } from 'react';

const steps = ['Basics', 'Ingredients', 'Steps'];

const Create: React.FunctionComponent = () => {
  const [activeStep, setActiveStep] = useState(0);

  const totalSteps = () => {
    return steps.length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const isFirstStep = () => {
    return activeStep === 0;
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const renderStepContent = (step: number): JSX.Element => {
    switch (step) {
      case 0:
        return (
          <Container sx={{ flexGrow: 1 }}>
            <Typography>Blubb</Typography>
          </Container>
        );
      case 1:
        return <div>Description</div>;
      case 2:
        return <div>Steps</div>;
      default:
        return <div>You broke it</div>;
    }
  };

  return (
    <Container sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((name: string, index: number) => (
          <Step key={index}>
            <StepButton>{name}</StepButton>
          </Step>
        ))}
      </Stepper>
      {renderStepContent(activeStep)}
      <Grid container justifyContent="space-evenly" alignItems="center" spacing={2} columns={12}>
        <Grid item xs={5}>
          <Button
            onClick={handleBack}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isFirstStep()}
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={5}>
          {!isLastStep() && (
            <Button onClick={handleNext} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Next
            </Button>
          )}
          {isLastStep() && (
            <Button onClick={handleReset} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Submit
            </Button>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Create;
