import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';
import { ChangeEvent, useState } from 'react';

type SetSectionNameProps = {
  open: boolean;
  close: () => void;
  submit: (value: string) => void;
};

const SetSectionName: React.FunctionComponent<SetSectionNameProps> = ({
  open,
  close,
  submit
}: SetSectionNameProps) => {
  const [name, setName] = useState<string>();
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const onSubmit = () => {
    console.log(`Dialog  value ${name}`);
    submit(name!);
    setName(undefined);
  };

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Set name of section</DialogTitle>
      <DialogContent>
        <DialogContentText>Give your section of ingredients a name.</DialogContentText>
        <TextField
          required
          variant="outlined"
          fullWidth
          label="Name"
          value={name}
          onChange={handleNameChange}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <Button variant="contained" disabled={!name} onClick={onSubmit}>
          Set name
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SetSectionName;
