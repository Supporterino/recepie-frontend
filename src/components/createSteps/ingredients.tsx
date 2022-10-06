import { Button, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Ingredient } from '../../types';
import Grid from '@mui/system/Unstable_Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { centerStyle, gridOutline } from '../layout/commonSx';
import FlexColContainer from '../layout/FlexColContainer';
import AddIngredient from './addIngredient';

const Ingredients: React.FunctionComponent = () => {
  const formContext = useFormContext();
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    formContext.getValues('ingredients') || []
  );
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleIngredientDelete = (toDelete: Ingredient) => {
    setIngredients(ingredients.filter((ingredient) => ingredient !== toDelete));
  };

  useEffect(() => {
    formContext.setValue('ingredients', ingredients);
  }, [formContext, ingredients]);

  return (
    <FlexColContainer>
      <AddIngredient open={open} close={handleClose} updateData={setIngredients} />
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
