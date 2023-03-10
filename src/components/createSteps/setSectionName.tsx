/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import {
  type ChangeEvent,
} from 'react';
import {
  useState,
} from 'react';
import {
  useTranslation,
} from 'react-i18next';

type SetSectionNameProps = {
  close: () => void,
  open: boolean,
  submit: (value: string) => void,
};

const SetSectionName: React.FunctionComponent<SetSectionNameProps> = ({
  open,
  close,
  submit,
}: SetSectionNameProps) => {
  const [
    name,
    setName,
  ] = useState<string>();
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const {
    t,
  } = useTranslation([
    'common',
    'create',
  ]);
  const onSubmit = () => {
    submit(name!);
    setName(undefined);
  };

  return (
    <Dialog onClose={close} open={open}>
      <DialogTitle>{t('create:sectionDialog.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('create:sectionDialog.text')}</DialogContentText>
        <TextField
          fullWidth
          label={t('create:sectionDialog.formFields.name')}
          onChange={handleNameChange}
          required
          sx={{
            mt: 1,
          }}
          value={name}
          variant='outlined'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>{t('common:buttons.cancel')}</Button>
        <Button disabled={!name} onClick={onSubmit} variant='contained'>
          {t('create:sectionDialog.formFields.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SetSectionName;
