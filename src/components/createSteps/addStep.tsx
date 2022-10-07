import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  FormControlLabel,
  Checkbox,
  DialogActions,
  Button
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState, ChangeEvent, SetStateAction, Dispatch } from 'react';

type AddStepProps = {
  open: boolean;
  close: () => void;
  updateData: Dispatch<SetStateAction<string[]>>;
};

const AddStep: React.FunctionComponent<AddStepProps> = ({
  open,
  close,
  updateData
}: AddStepProps) => {
  const [leaveOpen, setLeaveOpen] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const [step, setStep] = useState<string>();
  const handleStepChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStep(event.target.value);
  };

  const onSubmit = () => {
    if (step) {
      updateData((prevSteps) => [...prevSteps, step]);
      setStep(undefined);
      if (!leaveOpen) close();
    } else {
      enqueueSnackbar('Please enter a new step', { variant: 'warning' });
    }
  };

  return (
    <Dialog open={open} onClose={close}>
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
        <Button onClick={close}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>
          Add Step
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStep;
