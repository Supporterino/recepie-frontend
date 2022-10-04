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
  ListSubheader,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { ChangeEvent, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { allMeasures, AllMeasuresUnits, Ingredient, initConverter } from '../../types';
import Grid from '@mui/system/Unstable_Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { centerStyle, gridOutline } from '../layout/commonSx';
import FlexColContainer from '../layout/FlexColContainer';

const Ingredients: React.FunctionComponent = () => {
  const formContext = useFormContext();
  const { enqueueSnackbar } = useSnackbar();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const [open, setOpen] = useState<boolean>(false);
  const [leaveOpen, setLeaveOpen] = useState<boolean>(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const [name, setName] = useState<string>();
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const [amount, setAmount] = useState<number>();
  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(+event.target.value);
  };

  const [unit, setUnit] = useState<AllMeasuresUnits>();
  const handleUnitChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUnit(event.target.value as AllMeasuresUnits);
  };

  const allConverter = initConverter(allMeasures)();

  const onSubmit = () => {
    if (name && amount && unit) {
      setIngredients([{ name: name, amount: amount, unit: unit }, ...ingredients]);
      setName(undefined);
      setAmount(undefined);
      setUnit(undefined);
      if (!leaveOpen) setOpen(false);
    } else {
      enqueueSnackbar('Please fill out all required fields', { variant: 'warning' });
    }
  };

  const handleIngredientDelete = (toDelete: Ingredient) => {
    setIngredients(ingredients.filter((ingredient) => ingredient !== toDelete));
  };

  useEffect(() => {
    formContext.setValue('ingredients', ingredients);
  }, [formContext, ingredients]);

  return (
    <FlexColContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Ingredient</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to add a new ingredient to your recipe.
          </DialogContentText>
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
          <TextField
            required
            variant="outlined"
            select
            fullWidth
            label="Unit"
            value={unit}
            onChange={handleUnitChange}
            sx={{ mt: 1 }}
          >
            <ListSubheader>mass</ListSubheader>
            {allConverter.possibilities('mass').map((value: string) => (
              <MenuItem value={value} key={value}>
                {value}
              </MenuItem>
            ))}
            <ListSubheader>volume</ListSubheader>
            {allConverter.possibilities('volume').map((value: string) => (
              <MenuItem value={value} key={value}>
                {value}
              </MenuItem>
            ))}
            <ListSubheader>each</ListSubheader>
            {allConverter.possibilities('each').map((value: AllMeasuresUnits) => (
              <MenuItem value={value} key={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>
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
            Add Ingredient
          </Button>
        </DialogActions>
      </Dialog>

      {/* Actual UI */}
      <Button variant="outlined" onClick={handleOpen}>
        Add Ingredient
      </Button>

      <Grid container mt={1} sx={gridOutline}>
        <Grid xs={5} sx={centerStyle}>
          <Typography>Ingredient</Typography>
        </Grid>
        <Grid xs={5} sx={centerStyle}>
          <Typography>Amount</Typography>
        </Grid>
        <Grid xs={2} sx={centerStyle}>
          <Typography>Actions</Typography>
        </Grid>
        {ingredients.map((ing: Ingredient, index: number) => (
          <>
            <Grid xs={5} key={`${index}-name`} sx={centerStyle}>
              <Typography>{ing.name}</Typography>
            </Grid>
            <Grid xs={5} key={`${index}-amount`} sx={centerStyle}>
              <Typography>
                {ing.amount} {ing.unit}
              </Typography>
            </Grid>
            <Grid xs={2} key={`${index}-function`} sx={centerStyle}>
              <IconButton
                onClick={() => {
                  handleIngredientDelete(ing);
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

export default Ingredients;
