import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

type SetSectionNameProps = {
    open: boolean;
    close: () => void;
    submit: (value: string) => void;
};

const SetSectionName: React.FunctionComponent<SetSectionNameProps> = ({ open, close, submit }: SetSectionNameProps) => {
    const [name, setName] = useState<string>();
    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    const { t } = useTranslation(['common', 'create']);
    const onSubmit = () => {
        console.log(`Dialog  value ${name}`);
        submit(name!);
        setName(undefined);
    };

    return (
        <Dialog open={open} onClose={close}>
            <DialogTitle>{t('create:sectionDialog.title')}</DialogTitle>
            <DialogContent>
                <DialogContentText>{t('create:sectionDialog.text')}</DialogContentText>
                <TextField
                    required
                    variant="outlined"
                    fullWidth
                    label={t('create:sectionDialog.formFields.name')}
                    value={name}
                    onChange={handleNameChange}
                    sx={{ mt: 1 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>{t('common:buttons.cancel')}</Button>
                <Button variant="contained" disabled={!name} onClick={onSubmit}>
                    {t('create:sectionDialog.formFields.submit')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SetSectionName;
