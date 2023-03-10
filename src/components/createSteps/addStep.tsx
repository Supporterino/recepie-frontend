import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  TextField,
} from '@mui/material';
import {
  useSnackbar,
} from 'notistack';
import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {
  useRef,
  useState,
} from 'react';
import {
  useTranslation,
} from 'react-i18next';

type AddStepProps = {
  close: () => void,
  open: boolean,
  updateData: Dispatch<SetStateAction<string[]>>,
};

const AddStep: React.FunctionComponent<AddStepProps> = ({
  open,
  close,
  updateData,
}: AddStepProps) => {
  const [
    leaveOpen,
    setLeaveOpen,
  ] = useState<boolean>(false);
  const {
    enqueueSnackbar,
  } = useSnackbar();
  const {
    t,
  } = useTranslation([
    'common',
    'create',
  ]);

  const [
    step,
    setStep,
  ] = useState<string>();
  const handleStepChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStep(event.target.value);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = () => {
    if (step) {
      updateData((previousSteps) => {
        return [
          ...previousSteps,
          step,
        ];
      });
      setStep(undefined);
      if (inputRef.current) {
        inputRef.current.value = '';
      }

      if (!leaveOpen) {
        close();
      }
    } else {
      enqueueSnackbar(t('create:snackbar.emptyStep'), {
        variant: 'warning',
      });
    }
  };

  return (
    <Dialog onClose={close} open={open}>
      <DialogTitle>Add Step</DialogTitle>
      <DialogContent>
        <DialogContentText>You are about to add a new step to your recipe.</DialogContentText>
        <TextField
          fullWidth
          inputRef={inputRef}
          label={t('create:stepDialog.formFields.step')}
          maxRows={10}
          minRows={3}
          multiline
          onChange={handleStepChange}
          required
          sx={{
            mt: 1,
          }}
          value={step}
          variant='outlined'
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
          label={t('create:addDialog.formFields.addAnother')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>{t('common:buttons.cancel')}</Button>
        <Button onClick={onSubmit} variant='contained'>
          {t('create:stepDialog.formFields.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStep;
