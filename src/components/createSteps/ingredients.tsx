import { Button, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Ingredient, IngredientSection } from '../../types';
import Grid from '@mui/system/Unstable_Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { alignCenterJustifyCenter, centerStyle, gridOutline } from '../layout/commonSx';
import FlexColContainer from '../layout/FlexColContainer';
import AddIngredient from './addIngredient';
import SetSectionName from './setSectionName';
import Flex from '../layout/Flex';

const Ingredients: React.FunctionComponent = () => {
  const formContext = useFormContext();
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    formContext.getValues('ingredients') || []
  );
  const [sections, setSections] = useState<IngredientSection[]>(
    formContext.getValues('sections') || []
  );
  const [addOpen, setAddOpen] = useState<boolean>(false);
  const handleAddClose = () => setAddOpen(false);
  const handleAddOpen = () => setAddOpen(true);

  const [nameOpen, setNameOpen] = useState<boolean>(false);
  const handleNameClose = () => setNameOpen(false);
  const handleNameOpen = () => setNameOpen(true);

  const handleIngredientDelete = (toDelete: Ingredient) => {
    setIngredients(ingredients.filter((ingredient) => ingredient !== toDelete));
  };

  const handleSectionDelete = (toDelete: number) => {
    setSections(sections.filter((section, index) => index !== toDelete));
  };

  const handleSectionCreate = (sectionName: string) => {
    handleNameClose();
    console.log(sectionName);
    setSections((prevSections) => [
      ...prevSections,
      {
        name: sectionName,
        items: ingredients
      } as IngredientSection
    ]);
    setIngredients([]);
  };

  useEffect(() => {
    formContext.setValue('ingredients', ingredients);
  }, [formContext, ingredients]);

  useEffect(() => {
    formContext.setValue('sections', sections);
  }, [formContext, sections]);

  return (
    <FlexColContainer>
      <AddIngredient open={addOpen} close={handleAddClose} updateData={setIngredients} />
      <SetSectionName open={nameOpen} close={handleNameClose} submit={handleSectionCreate} />
      {/* Actual UI */}
      <Button variant="outlined" onClick={handleAddOpen}>
        Add Ingredient
      </Button>
      <Button
        variant="outlined"
        sx={{ mt: 1 }}
        disabled={ingredients.length === 0}
        onClick={handleNameOpen}
      >
        Make Sections
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
      {sections &&
        sections.map((section: IngredientSection, index: number) => (
          <>
            <Flex sx={{ mt: 1, ...alignCenterJustifyCenter }}>
              <Typography sx={{ flexGrow: 1 }} variant="h6">
                {section.name}
              </Typography>
              <IconButton
                onClick={() => {
                  handleSectionDelete(index);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Flex>
            <Grid container mt={1} sx={gridOutline}>
              <Grid xs={6} sx={centerStyle}>
                <Typography>Ingredient</Typography>
              </Grid>
              <Grid xs={6} sx={centerStyle}>
                <Typography>Amount</Typography>
              </Grid>
              {section.items.map((ing: Ingredient, index: number) => (
                <>
                  <Grid xs={6} key={`${index}-name`} sx={centerStyle}>
                    <Typography>{ing.name}</Typography>
                  </Grid>
                  <Grid xs={6} key={`${index}-amount`} sx={centerStyle}>
                    <Typography>
                      {ing.amount} {ing.unit}
                    </Typography>
                  </Grid>
                </>
              ))}
            </Grid>
          </>
        ))}
    </FlexColContainer>
  );
};

export default Ingredients;
