import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    FormControlLabel,
    Checkbox,
    DialogActions,
    Button,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState, ChangeEvent, SetStateAction, Dispatch, useRef } from 'react';
import { useTranslation } from 'react-i18next';

type AddStepProps = {
    open: boolean;
    close: () => void;
    updateData: Dispatch<SetStateAction<string[]>>;
};

const AddStep: React.FunctionComponent<AddStepProps> = ({ open, close, updateData }: AddStepProps) => {
    const [leaveOpen, setLeaveOpen] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation(['common', 'create']);

    const [step, setStep] = useState<string>();
    const handleStepChange = (event: ChangeEvent<HTMLInputElement>) => {
        setStep(event.target.value);
    };

    const inputRef = useRef<HTMLInputElement>(null);

    const onSubmit = () => {
        if (step) {
            updateData(prevSteps => [...prevSteps, step]);
            setStep(undefined);
            if (inputRef.current) inputRef.current.value = '';
            if (!leaveOpen) close();
        } else {
            enqueueSnackbar(t('create:snackbar.emptyStep'), { variant: 'warning' });
        }
    };

    return (
        <Dialog open={open} onClose={close}>
            <DialogTitle>Add Step</DialogTitle>
            <DialogContent>
                <DialogContentText>You are about to add a new step to your recipe.</DialogContentText>
                <TextField
                    required
                    inputRef={inputRef}
                    variant="outlined"
                    fullWidth
                    label={t('create:stepDialog.formFields.step')}
                    multiline
                    minRows={3}
                    maxRows={10}
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
                    label={t('create:addDialog.formFields.addAnother')}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>{t('common:buttons.cancel')}</Button>
                <Button variant="contained" onClick={onSubmit}>
                    {t('create:stepDialog.formFields.submit')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddStep;
