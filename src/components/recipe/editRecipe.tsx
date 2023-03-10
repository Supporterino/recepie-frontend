/* eslint-disable arrow-body-style */
/* eslint-disable no-confusing-arrow */
/* eslint-disable import/no-extraneous-dependencies */
import sendRequest, {
  editRecipeUrl,
} from '../../services/sendRequest';
import {
  type Ingredient,
  type IngredientSection,
  type Recipe,
} from '../../types';
import {
  moveInArray,
} from '../../utils/arrayUtils';
import AddIngredient from '../createSteps/AddIngredient';
import AddStep from '../createSteps/AddStep';
import EditSection from '../createSteps/EditSection';
import {
  alignCenterJustifyCenter,
  alignCenterJustifyStart,
  centerStyle,
  centerTopStyleCol,
  gridOutline,
} from '../layout/commonSx';
import Flex from '../layout/Flex';
import FlexCol from '../layout/FlexCol';
import FlexColContainer from '../layout/FlexColContainer';
import RecipeImage from './RecipeImage';
import TagList from './TagList';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Fab,
  IconButton,
  Rating,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  useSnackbar,
} from 'notistack';
import {
  Fragment,
  useState,
} from 'react';
import {
  useTranslation,
} from 'react-i18next';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

const EditRecipe: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const {
    enqueueSnackbar,
  } = useSnackbar();
  const queryClient = useQueryClient();
  const {
    id,
  } = useParams();
  const {
    state,
  } = useLocation();
  const recipe = state as Recipe;
  const {
    t,
  } = useTranslation([
    'common',
    'recipe',
  ]);

  if (!id) {
    navigate('/');
  }

  const [
    servings,
    setServings,
  ] = useState<number>(recipe.ingredients.numServings);
  const [
    ingredients,
    setIngredients,
  ] = useState<Ingredient[]>(recipe.ingredients.items || []);
  const [
    sections,
    setSections,
  ] = useState<IngredientSection[]>(recipe.ingredients.sections || []);
  const [
    steps,
    setSteps,
  ] = useState<string[]>(recipe.steps);
  const [
    description,
    setDescription,
  ] = useState<string>(recipe.description);
  const [
    name,
    setName,
  ] = useState<string>(recipe.name);
  const [
    tags,
    setTags,
  ] = useState<string[]>(recipe.tags);

  const handleIngredientDelete = (toDelete: Ingredient) => {
    setIngredients(ingredients.filter((ingredient) => {
      return ingredient !== toDelete;
    }));
  };

  const handleStepDelete = (toDelete: string) => {
    setSteps(steps.filter((step) => {
      return step !== toDelete;
    }));
  };

  const moveStep = (index: number, up: boolean) => {
    setSteps(moveInArray(steps, index, up));
  };

  const [
    addStepOpen,
    setAddStepOpen,
  ] = useState<boolean>(false);
  const [
    addIngredientOpen,
    setAddIngredientOpen,
  ] = useState<boolean>(false);
  const [
    editSectionOpen,
    setEditSectionOpen,
  ] = useState<boolean[]>(Array.from({
    length: sections.length,
  }).fill(false) as boolean[]);
  const [
    addSectionOpen,
    setAddSectionOpen,
  ] = useState<boolean>(false);

  const handleSectionDelete = (toDelete: number) => {
    setSections(sections.filter((section, index) => {
      return index !== toDelete;
    }));
  };

  const handleSectionUpdate = (value: IngredientSection, index: number) => {
    setSections(sections.map((item, array_index) => array_index === index ? value : item));
    setEditSectionOpen(editSectionOpen.map((item, array_index) => array_index === index ? false : item));
  };

  const handleSectionAdd = (value: IngredientSection) => {
    setEditSectionOpen([
      ...editSectionOpen,
      false,
    ]);
    setSections([
      ...sections,
      value,
    ]);
    setAddSectionOpen(false);
  };

  const editMutation = useMutation(
    () => {
      return sendRequest(editRecipeUrl, 'POST', {
        description,
        id,
        ingredients: {
          numServings: servings,
          ...sections.length > 0 ?
            {
              sections,
            } :
            {
              items: ingredients,
            },
        },
        name,
        steps,
        tags,
      });
    },
    {
      onError: () => {
        enqueueSnackbar(t('recipe:editView.error'), {
          variant: 'error',
        });
      },
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries([
            'recipes',
          ]),
          queryClient.invalidateQueries([
            'ownFavorites',
          ]),
          queryClient.invalidateQueries([
            'lists',
          ]),
          queryClient.invalidateQueries([
            'recipe',
            id,
          ]),
          queryClient.invalidateQueries([
            'ownRecipes',
          ]),
        ]);
        return navigate(`/recipe/${id}`, {
          replace: true,
        });
      },
    },
  );

  return (
    <FlexColContainer>
      <Flex sx={alignCenterJustifyStart}>
        <IconButton
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        <Box sx={{
          flexGrow: 1,
        }}
        />
      </Flex>
      <Flex>
        <RecipeImage
          height='100px'
          rounded
          sx={{
            boxShadow: 3,
            mr: 1,
            my: 1,
          }}
          url={`${recipe.picture === '' ? 'images/no-pictures.png' : recipe.picture}`}
          width='100px'
        />
        <FlexCol sx={{
          justifyContent: 'space-evenly',
        }}
        >
          <TextField
            fullWidth label={t('recipe:strings.name')} onChange={(event) => {
              return setName(event.target.value);
            }}
            value={name}
          />
          <Typography variant='body2'>
            {t('recipe:strings.by')} {recipe.owner.username}
          </Typography>
          <Flex sx={alignCenterJustifyStart}>
            <Rating precision={0.5} readOnly value={recipe.rating.avgRating} />
            <Typography
              ml={0.5} sx={{
                color: 'text.secondary',
              }} variant='body2'
            >
              ({recipe.rating.numOfRatings})
            </Typography>
          </Flex>
        </FlexCol>
      </Flex>
      <Typography variant='h6'>{t('recipe:strings.description')}</Typography>
      <TextField
        fullWidth
        label={t('recipe:strings.description')}
        multiline
        onChange={(event) => {
          return setDescription(event.target.value);
        }}
        size='small'
        sx={{
          my: 1,
        }}
        value={description}
      />
      <Typography variant='h6'>{t('recipe:strings.tags')}</Typography>
      <TagList editable initialTags={tags} updateHook={setTags} />
      <Typography variant='h6'>{t('recipe:strings.ingredients')}</Typography>
      <Flex sx={{
        mt: 1,
        ...alignCenterJustifyCenter,
      }}
      >
        <TextField
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*',
          }}
          label={t('recipe:strings.servings')}
          onChange={(event) => {
            return setServings(Number(event.target.value));
          }}
          size='small'
          type='number'
          value={servings}
        />
      </Flex>
      <AddIngredient
        close={() => {
          return setAddIngredientOpen(false);
        }} open={addIngredientOpen} updateData={setIngredients}
      />
      {ingredients.length > 0 &&
      <>
        <Button
          onClick={() => {
            return setAddIngredientOpen(true);
          }} sx={{
            my: 1,
          }} variant='outlined'
        >
          {t('recipe:editView.addIngredient')}
        </Button>
        <Grid container my={1} sx={gridOutline}>
          <Grid sx={centerTopStyleCol} xs={4}>
            <Typography
              ml={1} sx={{
                fontWeight: 'bold',
              }}
            >
              {t('recipe:strings.amount')}
            </Typography>
          </Grid>
          <Grid sx={centerTopStyleCol} xs={8}>
            <Typography
              ml={1} sx={{
                fontWeight: 'bold',
              }}
            >
              {t('recipe:strings.ingredient')}
            </Typography>
          </Grid>
          {ingredients.map((ing: Ingredient) => {
            return <Fragment key={ing.name}>
              <Grid key={`${ing.name}-amount`} sx={centerTopStyleCol} xs={4}>
                <Typography ml={1}>
                  {ing.amount} {ing.unit}
                </Typography>
              </Grid>
              <Grid key={`${ing.name}-name`} sx={centerTopStyleCol} xs={6}>
                <Typography ml={1}>{ing.name}</Typography>
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
      </>}
      {sections.length > 0 &&
      <>
        <Button
          onClick={() => {
            return setAddSectionOpen(true);
          }} sx={{
            my: 1,
          }} variant='outlined'
        >
          {t('recipe:editView.addSection')}
        </Button>
        <EditSection
          close={() => {
            return setAddSectionOpen(false);
          }}
          index={-1}
          initialName=''
          items={[]}
          mode='ADD'
          open={addSectionOpen}
          submit={handleSectionAdd}
        />
        {sections.map((section: IngredientSection, index: number) => {
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
            <Grid container my={1} sx={gridOutline}>
              <Grid sx={centerTopStyleCol} xs={4}>
                <Typography
                  ml={1} sx={{
                    fontWeight: 'bold',
                  }}
                >
                  {t('recipe:strings.amount')}
                </Typography>
              </Grid>
              <Grid sx={centerTopStyleCol} xs={8}>
                <Typography
                  ml={1} sx={{
                    fontWeight: 'bold',
                  }}
                >
                  {t('recipe:strings.ingredient')}
                </Typography>
              </Grid>
              {section.items.map((ing: Ingredient) => {
                return <Fragment key={ing.name}>
                  <Grid key={`${ing.name}-amount`} sx={centerTopStyleCol} xs={4}>
                    <Typography ml={1}>
                      {Math.round(
                        (ing.amount * (servings / recipe.ingredients.numServings) + Number.EPSILON) * 100,
                      ) / 100}
                      {ing.unit}
                    </Typography>
                  </Grid>
                  <Grid key={`${ing.name}-name`} sx={centerTopStyleCol} xs={8}>
                    <Typography ml={1}>{ing.name}</Typography>
                  </Grid>
                </Fragment>;
              })}
            </Grid>
          </Fragment>;
        })}
      </>}
      <Typography variant='h6'>{t('recipe:strings.steps')}</Typography>
      <AddStep
        close={() => {
          return setAddStepOpen(false);
        }} open={addStepOpen} updateData={setSteps}
      />
      <Button
        onClick={() => {
          return setAddStepOpen(true);
        }} sx={{
          my: 1,
        }} variant='outlined'
      >
        {t('recipe:editView.addStep')}
      </Button>
      <Grid container my={1} sx={gridOutline}>
        {steps.map((step: string, index: number) => {
          return <Fragment key={step}>
            <Grid sm={1} xs={2}>
              <Stack>
                <IconButton
                  disabled={index === 0} onClick={() => {
                    return moveStep(index, true);
                  }} size='small'
                >
                  <KeyboardArrowUpIcon />
                </IconButton>
                <IconButton
                  disabled={index === steps.length - 1} onClick={() => {
                    return moveStep(index, false);
                  }} size='small'
                >
                  <KeyboardArrowDownIcon />
                </IconButton>
              </Stack>
            </Grid>
            <Grid key={`${step}-name`} sm={9} sx={centerStyle} xs={8}>
              <Typography>{step}</Typography>
            </Grid>
            <Grid key={`${step}-function`} sx={centerStyle} xs={2}>
              <IconButton
                onClick={() => {
                  handleStepDelete(step);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Fragment>;
        })}
      </Grid>
      <Fab
        aria-label='add'
        color='primary'
        disabled={editMutation.isLoading}
        onClick={() => {
          return editMutation.mutate();
        }}
        sx={{
          bottom: 68,
          position: 'fixed',
          right: 36,
        }}
      >
        <SaveIcon />
      </Fab>
    </FlexColContainer>
  );
};

export default EditRecipe;
