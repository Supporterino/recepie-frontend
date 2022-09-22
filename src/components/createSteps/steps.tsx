import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { ChangeEvent, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Grid from '@mui/system/Unstable_Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { centerStyle } from '../layout/commonSx';
import FlexColContainer from '../layout/FlexColContainer';
import { moveInArray } from '../../utils/arrayUtils';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Steps: React.FunctionComponent = () => {
  const formContext = useFormContext();
  const { enqueueSnackbar } = useSnackbar();
  const [steps, setSteps] = useState<string[]>([]);

  const [open, setOpen] = useState<boolean>(false);
  const [leaveOpen, setLeaveOpen] = useState<boolean>(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const [step, setStep] = useState<string>();
  const handleStepChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStep(event.target.value);
  };

  const onSubmit = () => {
    if (step) {
      setSteps([step, ...steps]);
      if (!leaveOpen) setOpen(false);
    } else {
      enqueueSnackbar('Please enter a new step', { variant: 'warning' });
    }
  };

  const handleStepDelete = (toDelete: string) => {
    setSteps(steps.filter((step) => step !== toDelete));
  };

  const moveStep = (index: number, up: boolean) => {
    setSteps(moveInArray(steps, index, up));
  };

  useEffect(() => {
    formContext.setValue('steps', steps);
  }, [formContext, steps]);

  return (
    <FlexColContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Step</DialogTitle>
        <DialogContent>
          <DialogContentText>You are about to add a new step to your recipe.</DialogContentText>
          <TextField
            required
            variant="outlined"
            fullWidth
            label="Step"
            multiline
            maxRows={4}
            value={step}
            onChange={handleStepChange}
            sx={{ mt: 1 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={leaveOpen}
                onChange={() => {
                  setLeaveOpen(!leaveOpen);
                }}
              />
            }
            label="Add another"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={onSubmit}>
            Add Step
          </Button>
        </DialogActions>
      </Dialog>

      {/* Actual UI */}
      <Button variant="outlined" onClick={handleOpen}>
        Add Step
      </Button>

      <Typography m={1} variant="h6">
        Steps
      </Typography>
      <Grid container mt={1}>
        {steps.map((step: string, index: number) => (
          <>
            <Grid xs={2} sm={1}>
              <Stack>
                <IconButton
                  size="small"
                  disabled={index === 0}
                  onClick={() => moveStep(index, true)}
                >
                  <KeyboardArrowUpIcon />
                </IconButton>
                <IconButton
                  size="small"
                  disabled={index === steps.length - 1}
                  onClick={() => moveStep(index, false)}
                >
                  <KeyboardArrowDownIcon />
                </IconButton>
              </Stack>
            </Grid>

            <Grid xs={8} sm={9} key={`${index}-name`} sx={centerStyle}>
              <Typography>{step}</Typography>
            </Grid>
            <Grid xs={2} key={`${index}-function`} sx={centerStyle}>
              <IconButton
                onClick={() => {
                  handleStepDelete(step);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </>
        ))}
      </Grid>
    </FlexColContainer>
  );
};

export default Steps;
