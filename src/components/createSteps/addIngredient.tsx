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
import { useState, ChangeEvent, Dispatch, SetStateAction } from 'react';
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

  const [name, setName] = useState<string>();
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const [amount, setAmount] = useState<number>();
  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(+event.target.value);
  };

  const [unit, setUnit] = useState<AllMeasuresUnits>();
  const handleUnitChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: {
      category: string;
      unit: AllMeasuresUnits;
    } | null
  ) => {
    if (value) setUnit(value.unit as AllMeasuresUnits);
  };

  const allConverter = initConverter(allMeasures)();

  const options: { category: string; unit: AllMeasuresUnits }[] = [];
  ['mass', 'volume', 'each'].forEach((option: string) => {
    allConverter
      .possibilities(option as AllMeasures)
      .forEach((unit) => options.push({ category: option, unit }));
  });

  const onSubmit = () => {
    if (name && amount && unit) {
      updateData((prevIngredients) => [...prevIngredients, { name, amount, unit }]);
      setAmount(undefined);
      setName(undefined);
      setUnit(undefined);
      if (!leaveOpen) close()
    } else {
      enqueueSnackbar('Please fillout all fields!', { variant: 'warning' });
    }
  };

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Add Ingredient</DialogTitle>
      <DialogContent>
        <DialogContentText>You are about to add a new ingredient to your recipe.</DialogContentText>
        <TextField
          required
          variant="outlined"
          fullWidth
          label="Name"
          value={name}
          onChange={handleNameChange}
          sx={{ mt: 1 }}
        />
        <TextField
          required
          variant="outlined"
          type="number"
          fullWidth
          label="Amount"
          value={amount}
          onChange={handleAmountChange}
          sx={{ mt: 1 }}
        />
        <Autocomplete
          openOnFocus
          sx={{ mt: 1 }}
          id="unit"
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
          label="Add another"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>
          Add Ingredient
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddIngredient;
