import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  DialogActions,
  Button
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState, ChangeEvent, Dispatch, SetStateAction, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AllMeasuresUnits, initConverter, allMeasures, AllMeasures, Ingredient } from '../../types';

type AddIngredientProps = {
  open: boolean;
  close: () => void;
  updateData: Dispatch<SetStateAction<Ingredient[]>>;
};

const AddIngredient: React.FunctionComponent<AddIngredientProps> = ({
  open,
  close,
  updateData
}: AddIngredientProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [leaveOpen, setLeaveOpen] = useState<boolean>(false);
  const { t } = useTranslation(['common', 'create']);

  const [name, setName] = useState<string>();
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const [amount, setAmount] = useState<number>();
  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(+event.target.value);
  };

  const [unit, setUnit] = useState<{ category: string; unit: AllMeasuresUnits }>();
  const handleUnitChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: {
      category: string;
      unit: AllMeasuresUnits;
    } | null
  ) => {
    if (value) setUnit(value);
  };

  const allConverter = initConverter(allMeasures)();

  const options: { category: string; unit: AllMeasuresUnits }[] = [];
  ['mass', 'volume', 'each'].forEach((option: string) => {
    allConverter
      .possibilities(option as AllMeasures)
      .forEach((unit) => options.push({ category: option, unit }));
  });

  const inputRefUnit = useRef<HTMLInputElement>(null);
  const inputRefName = useRef<HTMLInputElement>(null);
  const inputRefAmount = useRef<HTMLInputElement>(null);

  const onSubmit = () => {
    if (name && amount && unit) {
      updateData((prevIngredients) => [...prevIngredients, { name, amount, unit: unit.unit }]);
      setAmount(undefined);
      setName(undefined);
      setUnit(undefined);
      if (inputRefUnit.current) inputRefUnit.current.value = '';
      if (inputRefAmount.current) inputRefAmount.current.value = '';
      if (inputRefName.current) inputRefName.current.value = '';
      if (!leaveOpen) close();
    } else {
      enqueueSnackbar(t('create:snackbar.errorFields'), { variant: 'warning' });
    }
  };

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>{t('create:addDialog.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('create:addDialog.text')}</DialogContentText>
        <TextField
          required
          variant="outlined"
          fullWidth
          label={t('create:addDialog.formFields.name')}
          inputRef={inputRefName}
          value={name}
          onChange={handleNameChange}
          sx={{ mt: 1 }}
        />
        <TextField
          required
          variant="outlined"
          type="number"
          fullWidth
          inputRef={inputRefAmount}
          label={t('create:addDialog.formFields.amount')}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          value={amount}
          onChange={handleAmountChange}
          sx={{ mt: 1 }}
        />
        <Autocomplete
          openOnFocus
          sx={{ mt: 1 }}
          id="unit"
          value={unit}
          ref={inputRefUnit}
          options={options.sort((a, b) => -b.category.localeCompare(a.category))}
          groupBy={(option) => option.category}
          getOptionLabel={(option) => option.unit}
          onChange={handleUnitChange}
          renderInput={(params) => <TextField label="Unit" {...params} variant="outlined" />}
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
          {t('create:addDialog.formFields.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddIngredient;
