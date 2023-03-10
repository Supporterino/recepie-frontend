/* eslint-disable arrow-body-style */
/* eslint-disable no-confusing-arrow */
/* eslint-disable import/no-extraneous-dependencies */
import {
  type Ingredient,
  type IngredientSection,
} from '../../types';
import {
  alignCenterJustifyCenter,
  centerStyle,
  gridOutline,
} from '../layout/commonSx';
import Flex from '../layout/Flex';
import FlexColContainer from '../layout/FlexColContainer';
import AddIngredient from './AddIngredient';
import EditSection from './EditSection';
import SetSectionName from './SetSectionName';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import {
  Fragment,
  useEffect,
  useState,
} from 'react';
import {
  useFormContext,
} from 'react-hook-form';
import {
  useTranslation,
} from 'react-i18next';

const Ingredients: React.FunctionComponent = () => {
  const formContext = useFormContext();
  const [
    ingredients,
    setIngredients,
  ] = useState<Ingredient[]>(formContext.getValues('ingredients') || []);
  const [
    sections,
    setSections,
  ] = useState<IngredientSection[]>(formContext.getValues('sections') || []);
  const [
    addOpen,
    setAddOpen,
  ] = useState<boolean>(false);
  const handleAddClose = () => {
    return setAddOpen(false);
  };

  const handleAddOpen = () => {
    return setAddOpen(true);
  };

  const [
    nameOpen,
    setNameOpen,
  ] = useState<boolean>(false);
  const handleNameClose = () => {
    return setNameOpen(false);
  };

  const handleNameOpen = () => {
    return setNameOpen(true);
  };

  const {
    t,
  } = useTranslation([
    'common',
    'create',
  ]);

  const [
    editSectionOpen,
    setEditSectionOpen,
  ] = useState<boolean[]>(Array.from({
    length: sections.length,
  }).fill(false) as boolean[]);

  const handleIngredientDelete = (toDelete: Ingredient) => {
    setIngredients(ingredients.filter((ingredient) => {
      return ingredient !== toDelete;
    }));
  };

  const handleSectionDelete = (toDelete: number) => {
    setSections(sections.filter((section, index) => {
      return index !== toDelete;
    }));
  };

  const handleSectionCreate = (sectionName: string) => {
    handleNameClose();
    setSections((previousSections) => {
      return [
        ...previousSections,
        {
          items: ingredients,
          name: sectionName,
        } as IngredientSection,
      ];
    });
    setIngredients([]);
  };

  const handleSectionUpdate = (value: IngredientSection, index: number) => {
    setSections(sections.map((item, array_index) => array_index === index ? value : item));
    setEditSectionOpen(editSectionOpen.map((item, array_index) => array_index === index ? false : item));
  };

  useEffect(() => {
    formContext.setValue('ingredients', ingredients);
  }, [
    formContext,
    ingredients,
  ]);

  useEffect(() => {
    formContext.setValue('sections', sections);
  }, [
    formContext,
    sections,
  ]);

  return (
    <FlexColContainer>
      <AddIngredient close={handleAddClose} open={addOpen} updateData={setIngredients} />
      <SetSectionName close={handleNameClose} open={nameOpen} submit={handleSectionCreate} />
      {/* Actual UI */}
      <Button onClick={handleAddOpen} variant='outlined'>
        {t('create:ingredientsDialog.buttons.add')}
      </Button>
      <Button
        disabled={ingredients.length === 0} onClick={handleNameOpen} sx={{
          mt: 1,
        }}
        variant='outlined'
      >
        {t('create:ingredientsDialog.buttons.section')}
      </Button>
      <Grid container mt={1} sx={gridOutline}>
        <Grid sx={centerStyle} xs={5}>
          <Typography>{t('create:ingredientsDialog.formFields.ingredient')}</Typography>
        </Grid>
        <Grid sx={centerStyle} xs={5}>
          <Typography>{t('create:ingredientsDialog.formFields.amount')}</Typography>
        </Grid>
        <Grid sx={centerStyle} xs={2}>
          <Typography>{t('create:ingredientsDialog.formFields.action')}</Typography>
        </Grid>
        {ingredients.map((ing: Ingredient) => {
          return <Fragment key={ing.name}>
            <Grid key={`${ing.name}-name`} sx={centerStyle} xs={5}>
              <Typography>{ing.name}</Typography>
            </Grid>
            <Grid key={`${ing.name}-amount`} sx={centerStyle} xs={5}>
              <Typography>
                {ing.amount} {ing.unit}
              </Typography>
            </Grid>
            <Grid key={`${ing.name}-function`} sx={centerStyle} xs={2}>
              <IconButton
                onClick={() => {
                  handleIngredientDelete(ing);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Fragment>;
        })}
      </Grid>
      {sections?.map((section: IngredientSection, index: number) => {
        return <Fragment key={section.name}>
          <EditSection
            close={() => {
              return setEditSectionOpen(editSectionOpen.map((item, array_index) => array_index === index ? false : item));
            }}
            index={index}
            initialName={section.name}
            items={section.items}
            mode='EDIT'
            open={editSectionOpen[index]}
            submit={handleSectionUpdate}
          />
          <Flex sx={{
            mt: 1,
            ...alignCenterJustifyCenter,
          }}
          >
            <Typography
              sx={{
                flexGrow: 1,
              }} variant='h6'
            >
              {section.name}
            </Typography>
            <IconButton
              onClick={() => {
                return setEditSectionOpen(editSectionOpen.map((item, array_index) => array_index === index ? true : item));
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                handleSectionDelete(index);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Flex>
          <Grid container mt={1} sx={gridOutline}>
            <Grid sx={centerStyle} xs={6}>
              <Typography>{t('create:ingredientsDialog.formFields.ingredient')}</Typography>
            </Grid>
            <Grid sx={centerStyle} xs={6}>
              <Typography>{t('create:ingredientsDialog.formFields.amount')}</Typography>
            </Grid>
            {section.items.map((ing: Ingredient) => {
              return <Fragment key={ing.name}>
                <Grid key={`${ing.name}-name`} sx={centerStyle} xs={6}>
                  <Typography>{ing.name}</Typography>
                </Grid>
                <Grid key={`${ing.name}-amount`} sx={centerStyle} xs={6}>
                  <Typography>
                    {ing.amount} {ing.unit}
                  </Typography>
                </Grid>
              </Fragment>;
            })}
          </Grid>
        </Fragment>;
      })}
    </FlexColContainer>
  );
};

export default Ingredients;
