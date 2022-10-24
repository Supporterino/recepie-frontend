import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Rating,
  TextField,
  Typography
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Grid from '@mui/system/Unstable_Grid';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect, useState } from 'react';
import { Share, Upload } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PendingIcon from '@mui/icons-material/Pending';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import useLoggedIn from '../../hooks/useLoggedIn';
import { authenticationManager } from '../../services/AuthenticationManager';
import { getRecipe, checkOwner } from '../../services/requests';
import sendRequest, {
  removeFavoriteUrl,
  addFavoriteUrl,
  removeCookListUrl,
  addCookListUrl
} from '../../services/requestService';
import { Recipe, Ingredient, IngredientSection } from '../../types';
import ImageUpload, { Target } from '../createSteps/imageUpload';
import {
  alignCenterJustifyStart,
  alignCenterJustifyCenter,
  gridOutline,
  centerTopStyleCol,
  centerStyle
} from '../layout/commonSx';
import Flex from '../layout/Flex';
import FlexCol from '../layout/FlexCol';
import FlexColContainer from '../layout/FlexColContainer';
import ErrorDisplay from '../queryUtils/ErrorText';
import Loader from '../queryUtils/Loader';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteRecipe from './DeleteRecipe';
import Review from './Rating';
import RecipeImage from './RecipeImage';

const RecipeView: React.FunctionComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [uploadOpen, setUploadOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [reviewOpen, setReviewOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const loggedIn = useLoggedIn();

  if (!id) navigate('/');

  const {
    isLoading,
    isError,
    error,
    data: recipe
  } = useQuery<Recipe>(['recipe', id], () => getRecipe(id!));
  const [servings, setServings] = useState<number>(1);
  useEffect(() => {
    if (recipe) setServings(recipe.ingredients.numServings);
  }, [recipe]);

  const { data: isOwner } = useQuery<boolean>(['isOwner', id], () => checkOwner(id!), {
    enabled: authenticationManager.hasUser()
  });
  const owner = Boolean(isOwner);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const share = async () => {
    try {
      await navigator.share({
        url: `/recipe/${id}`,
        title: 'Recipe Title',
        text: 'Here is a recipe for you'
      });
    } catch (error) {
      enqueueSnackbar('Failed to share recipe via navigator', { variant: 'warning' });
    }
  };

  const favMutation = useMutation(
    () =>
      recipe!.isFavorite
        ? sendRequest(removeFavoriteUrl, 'DELETE', { recipeID: id })
        : sendRequest(addFavoriteUrl, 'POST', { recipeID: id }),
    {
      onSuccess: () => {
        return Promise.all([
          queryClient.invalidateQueries(['recipes']),
          queryClient.invalidateQueries(['ownFavorites']),
          queryClient.invalidateQueries(['lists']),
          queryClient.invalidateQueries(['recipe', id]),
          queryClient.invalidateQueries(['ownRecipes'])
        ]);
      },
      onError: (error, variables, context) => {
        enqueueSnackbar('Failed to set favorite on recipe', { variant: 'warning' });
      }
    }
  );

  const cooklistMutation = useMutation(
    () =>
      recipe!.isCookList
        ? sendRequest(removeCookListUrl, 'DELETE', { recipeID: id })
        : sendRequest(addCookListUrl, 'POST', { recipeID: id }),
    {
      onSuccess: () => {
        return Promise.all([
          queryClient.invalidateQueries(['recipes']),
          queryClient.invalidateQueries(['cooklist']),
          queryClient.invalidateQueries(['lists']),
          queryClient.invalidateQueries(['recipe', id]),
          queryClient.invalidateQueries(['ownRecipes'])
        ]);
      },
      onError: (error, variables, context) => {
        enqueueSnackbar('Failed to set cooklist on recipe', { variant: 'warning' });
      }
    }
  );

  if (isLoading)
    return (
      <FlexColContainer>
        <Loader />
      </FlexColContainer>
    );

  if (isError)
    return (
      <FlexColContainer>
        <ErrorDisplay text={`${error}`} />
      </FlexColContainer>
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
        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
      </Flex>

      <Flex>
        <RecipeImage
          width="100px"
          height="100px"
          url={`${recipe.picture !== '' ? recipe.picture : 'images/no-pictures.png'}`}
          sx={{ mr: 1, my: 1, boxShadow: 3 }}
          rounded
        />
        <FlexCol sx={{ justifyContent: 'space-evenly' }}>
          <Typography variant="h5">{recipe.name}</Typography>
          <Typography variant="body2">by {recipe.owner.username}</Typography>
          <Flex
            sx={alignCenterJustifyStart}
            onClick={() => {
              setReviewOpen(true);
            }}
          >
            <Rating value={recipe.rating.avgRating} readOnly precision={0.5} />
            <Typography sx={{ color: 'text.secondary' }} variant="body2" ml={0.5}>
              ({recipe.rating.numOfRatings})
            </Typography>
          </Flex>
        </FlexCol>
      </Flex>

      <Review
        open={reviewOpen}
        close={() => {
          setReviewOpen(false);
        }}
        recipeID={id!}
      />

      <Typography variant="h6">Description</Typography>
      <Typography variant="body2" mb={1}>
        {recipe.description}
      </Typography>

      <Typography variant="h6">Ingredients</Typography>
      <Flex sx={{ mt: 1, ...alignCenterJustifyCenter }}>
        <IconButton size="small" onClick={() => setServings((prev) => prev + 1)}>
          <AddIcon />
        </IconButton>
        <TextField
          size="small"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          label="Servings"
          onChange={(event) => setServings(+event.target.value)}
          value={servings}
        ></TextField>
        <IconButton
          size="small"
          disabled={servings === 1}
          onClick={() => setServings((prev) => prev - 1)}
        >
          <RemoveIcon />
        </IconButton>
      </Flex>

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
        {recipe.ingredients.items &&
          recipe.ingredients.items.map((ing: Ingredient, index: number) => (
            <>
              <Grid xs={4} key={`${index}-amount`} sx={centerTopStyleCol}>
                <Typography ml={1}>
                  {Math.round(
                    (ing.amount * (servings / recipe.ingredients.numServings) + Number.EPSILON) *
                      100
                  ) / 100}
                  {ing.unit}
                </Typography>
              </Grid>
              <Grid xs={8} key={`${index}-name`} sx={centerTopStyleCol}>
                <Typography ml={1}>{ing.name}</Typography>
              </Grid>
            </>
          ))}
        {recipe.ingredients.sections &&
          recipe.ingredients.sections.map((section: IngredientSection, index: number) => (
            <>
              <Grid xs={12} sx={centerStyle}>
                <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }} my={0.2}>
                  {section.name}
                </Typography>
              </Grid>
              {section.items.map((ing: Ingredient, index: number) => (
                <>
                  <Grid xs={4} key={`${index}-amount`} sx={centerTopStyleCol}>
                    <Typography ml={1}>
                      {Math.round(
                        (ing.amount * (servings / recipe.ingredients.numServings) +
                          Number.EPSILON) *
                          100
                      ) / 100}
                      {ing.unit}
                    </Typography>
                  </Grid>
                  <Grid xs={8} key={`${index}-name`} sx={centerTopStyleCol}>
                    <Typography ml={1}>{ing.name}</Typography>
                  </Grid>
                </>
              ))}
            </>
          ))}
      </Grid>

      <Typography variant="h6">Steps</Typography>
      <Grid container my={1} sx={gridOutline}>
        {recipe.steps.map((step: string, index: number) => (
          <>
            <Grid xs={2} key={`${index}-key`} sx={centerStyle}>
              <Typography>{index + 1}.</Typography>
            </Grid>
            <Grid xs={10} key={`${index}-name`} sx={centerTopStyleCol}>
              <Typography ml={1}>{step}</Typography>
            </Grid>
          </>
        ))}
      </Grid>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem onClick={share}>
          <ListItemIcon>
            <Share fontSize="small" color="secondary" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
        {loggedIn && (
          <MenuItem
            onClick={() => {
              favMutation.mutate();
            }}
          >
            <ListItemIcon>
              {recipe.isFavorite && !favMutation.isLoading && (
                <FavoriteIcon color="error" fontSize="small" />
              )}
              {!recipe.isFavorite && !favMutation.isLoading && (
                <FavoriteBorderIcon color="secondary" fontSize="small" />
              )}
              {favMutation.isLoading && <PendingIcon color="secondary" fontSize="small" />}
            </ListItemIcon>
            <ListItemText>
              {favMutation.isLoading
                ? 'Pending...'
                : recipe.isFavorite
                ? 'Remove from Favorites'
                : 'Add to Favorites'}
            </ListItemText>
          </MenuItem>
        )}
        {loggedIn && (
          <MenuItem
            onClick={() => {
              cooklistMutation.mutate();
            }}
          >
            <ListItemIcon>
              {recipe.isCookList && !cooklistMutation.isLoading && (
                <BookmarkIcon color="primary" fontSize="small" />
              )}
              {!recipe.isCookList && !cooklistMutation.isLoading && (
                <BookmarkBorderIcon color="secondary" fontSize="small" />
              )}
              {cooklistMutation.isLoading && <PendingIcon color="secondary" fontSize="small" />}
            </ListItemIcon>
            <ListItemText>
              {cooklistMutation.isLoading
                ? 'Pending...'
                : recipe.isCookList
                ? 'Remove from Cooklist'
                : 'Add to Cooklist'}
            </ListItemText>
          </MenuItem>
        )}
        {owner && (
          <MenuItem
            onClick={() => {
              setUploadOpen(true);
            }}
          >
            <ListItemIcon>
              <Upload fontSize="small" color="secondary" />
            </ListItemIcon>
            <ListItemText>Upload Image</ListItemText>
          </MenuItem>
        )}
        {owner && (
          <MenuItem
            onClick={() => {
              navigate(`/edit/${id}`, { state: recipe });
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" color="secondary" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        {owner && (
          <MenuItem
            onClick={() => {
              setDeleteOpen(true);
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>
      {owner && (
        <ImageUpload
          open={uploadOpen}
          close={() => {
            setUploadOpen(false);
          }}
          target={Target.RECIPE}
          recipeID={id!}
        />
      )}
      {owner && (
        <DeleteRecipe
          open={deleteOpen}
          close={() => {
            setDeleteOpen(false);
          }}
          recipeID={id!}
        />
      )}
    </FlexColContainer>
  );
};

export default RecipeView;
