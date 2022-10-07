import { Box, Button, Fab, IconButton, Rating, Stack, TextField, Typography } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Ingredient, Recipe } from '../types';
import Flex from './layout/Flex';
import FlexCol from './layout/FlexCol';
import FlexColContainer from './layout/FlexColContainer';
import Grid from '@mui/system/Unstable_Grid';
import {
  alignCenterJustifyCenter,
  alignCenterJustifyStart,
  centerStyle,
  centerTopStyleCol,
  gridOutline
} from './layout/commonSx';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { moveInArray } from '../utils/arrayUtils';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddStep from './createSteps/addStep';
import AddIngredient from './createSteps/addIngredient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import sendRequest, { editRecipeUrl } from '../services/requestService';
import SaveIcon from '@mui/icons-material/Save';

const EditRecipeView: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { state } = useLocation();
  const recipe = state as Recipe;

  if (!id) navigate('/');

  const [servings, setServings] = useState<number>(recipe.ingredients.numServings);
  const [ingredients, setIngredients] = useState<Ingredient[]>(recipe.ingredients.items);
  const [steps, setSteps] = useState<string[]>(recipe.steps);
  const [description, setDescription] = useState<string>(recipe.description);
  const [name, setName] = useState<string>(recipe.name);

  const handleIngredientDelete = (toDelete: Ingredient) => {
    setIngredients(ingredients.filter((ingredient) => ingredient !== toDelete));
  };

  const handleStepDelete = (toDelete: string) => {
    setSteps(steps.filter((step) => step !== toDelete));
  };

  const moveStep = (index: number, up: boolean) => {
    setSteps(moveInArray(steps, index, up));
  };

  const [addStepOpen, setAddStepOpen] = useState<boolean>(false);
  const [addIngredientOpen, setAddIngredientOpen] = useState<boolean>(false);

  // TODO: Add tag editing
  const editMutation = useMutation(
    () =>
      sendRequest(editRecipeUrl, 'POST', {
        id,
        name,
        description,
        ingredients: { numServings: servings, items: ingredients },
        steps
      }),
    {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(['recipes']),
          queryClient.invalidateQueries(['ownFavorites']),
          queryClient.invalidateQueries(['lists']),
          queryClient.invalidateQueries(['recipe', id])
        ]);
        return navigate(`/recipe/${id}`, { replace: true });
      },
      onError: (error, variables, context) => {
        enqueueSnackbar('Failed to edit recipe', { variant: 'error' });
      }
    }
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
        <Box sx={{ flexGrow: 1 }} />
      </Flex>

      <Flex>
        <Box
          sx={{
            width: '100px',
            height: '100px',
            backgroundImage: `url(${
              recipe.picture !== '' ? recipe.picture : 'images/no-pictures.png'
            })`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            m: 1,
            borderRadius: 2,
            border: 0,
            boxShadow: 3
          }}
        />
        <FlexCol sx={{ justifyContent: 'space-evenly' }}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Typography variant="body2">by {recipe.owner.username}</Typography>
          <Flex sx={alignCenterJustifyStart}>
            <Rating value={recipe.rating.avgRating} readOnly precision={0.5} />
            <Typography sx={{ color: 'text.secondary' }} variant="body2" ml={0.5}>
              ({recipe.rating.numOfRatings})
            </Typography>
          </Flex>
        </FlexCol>
      </Flex>

      <Typography variant="h6">Description</Typography>
      <TextField
        size="small"
        fullWidth
        label="Description"
        multiline
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        sx={{ my: 1 }}
      />

      <Typography variant="h6">Ingredients</Typography>
      <Flex sx={{ mt: 1, ...alignCenterJustifyCenter }}>
        <TextField
          size="small"
          type="number"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          label="Servings"
          onChange={(event) => setServings(+event.target.value)}
          value={servings}
        ></TextField>
      </Flex>
      <AddIngredient
        open={addIngredientOpen}
        close={() => setAddIngredientOpen(false)}
        updateData={setIngredients}
      />
      <Button variant="outlined" sx={{ my: 1 }} onClick={() => setAddIngredientOpen(true)}>
        Add new ingredient
      </Button>
      <Grid container my={1} sx={gridOutline}>
        <Grid xs={4} sx={centerTopStyleCol}>
          <Typography sx={{ fontWeight: 'bold' }} ml={1}>
            Amount
          </Typography>
        </Grid>
        <Grid xs={8} sx={centerTopStyleCol}>
          <Typography sx={{ fontWeight: 'bold' }} ml={1}>
            Ingredient
          </Typography>
        </Grid>
        {ingredients.map((ing: Ingredient, index: number) => (
          <>
            <Grid xs={4} key={`${index}-amount`} sx={centerTopStyleCol}>
              <Typography ml={1}>
                {ing.amount} {ing.unit}
              </Typography>
            </Grid>
            <Grid xs={6} key={`${index}-name`} sx={centerTopStyleCol}>
              <Typography ml={1}>{ing.name}</Typography>
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

      <Typography variant="h6">Steps</Typography>
      <AddStep open={addStepOpen} close={() => setAddStepOpen(false)} updateData={setSteps} />
      <Button variant="outlined" sx={{ my: 1 }} onClick={() => setAddStepOpen(true)}>
        Add new step
      </Button>
      <Grid container my={1} sx={gridOutline}>
        {steps.map((step: string, index: number) => (
          <>
            <Grid xs={2} sm={1}>
              <Stack>
                <IconButton
                  size="small"
                  disabled={index === 0}
                  onClick={() => moveStep(index, true)}
                >
                  <KeyboardArrowUpIcon />
                </IconButton>
                <IconButton
                  size="small"
                  disabled={index === steps.length - 1}
                  onClick={() => moveStep(index, false)}
                >
                  <KeyboardArrowDownIcon />
                </IconButton>
              </Stack>
            </Grid>
            <Grid xs={8} sm={9} key={`${index}-name`} sx={centerStyle}>
              <Typography>{step}</Typography>
            </Grid>
            <Grid xs={2} key={`${index}-function`} sx={centerStyle}>
              <IconButton
                onClick={() => {
                  handleStepDelete(step);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </>
        ))}
      </Grid>
      <Fab
        sx={{
          position: 'fixed',
          bottom: 68,
          right: 36
        }}
        color="primary"
        aria-label="add"
        onClick={() => editMutation.mutate()}
        disabled={editMutation.isLoading}
      >
        <SaveIcon />
      </Fab>
    </FlexColContainer>
  );
};

export default EditRecipeView;
