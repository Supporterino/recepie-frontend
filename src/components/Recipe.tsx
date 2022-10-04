import {
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Rating,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { checkOwner, getRecipe } from '../services/requests';
import { Ingredient, Recipe } from '../types';
import Flex from './layout/Flex';
import FlexCol from './layout/FlexCol';
import FlexColContainer from './layout/FlexColContainer';
import ErrorDisplay from './queryUtils/ErrorText';
import Loader from './queryUtils/Loader';
import Grid from '@mui/system/Unstable_Grid';
import {
  alignCenterJustifyStart,
  centerStyle,
  centerTopStyleCol,
  gridOutline
} from './layout/commonSx';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { Share, Upload } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import ImageUpload, { Target } from './createSteps/imageUpload';
import { authenticationManager } from '../services/AuthenticationManager';

const RecipeView: React.FunctionComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [uploadOpen, setUploadOpen] = useState<boolean>(false);

  if (!id) navigate('/');

  const {
    isLoading,
    isError,
    error,
    data: recipe
  } = useQuery<Recipe>(['recipe', id], () => getRecipe(id!));

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
        <Button
          size="small"
          onClick={() => {
            navigate(-1);
          }}
          startIcon={<ArrowBackIosNewIcon />}
        >
          Back
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
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
          <Typography variant="h5">{recipe.name}</Typography>
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
      <Typography variant="body2" mb={1}>
        {recipe.description}
      </Typography>
      <Divider light />

      <Typography variant="h6">Ingredients</Typography>
      <Grid container my={1} sx={gridOutline}>
        <Grid xs={4} sx={centerTopStyleCol}>
          <Typography sx={{ fontWeight: 'bold' }} ml={1}>
            Ingredient
          </Typography>
        </Grid>
        <Grid xs={8} sx={centerTopStyleCol}>
          <Typography sx={{ fontWeight: 'bold' }} ml={1}>
            Amount
          </Typography>
        </Grid>
        {recipe.ingredients.items.map((ing: Ingredient, index: number) => (
          <>
            <Grid xs={4} key={`${index}-amount`} sx={centerTopStyleCol}>
              <Typography ml={1}>
                {ing.amount} {ing.unit}
              </Typography>
            </Grid>
            <Grid xs={8} key={`${index}-name`} sx={centerTopStyleCol}>
              <Typography ml={1}>{ing.name}</Typography>
            </Grid>
          </>
        ))}
      </Grid>
      <Divider light />

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
            <Share fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
        {owner && (
          <MenuItem
            onClick={() => {
              setUploadOpen(true);
            }}
          >
            <ListItemIcon>
              <Upload fontSize="small" />
            </ListItemIcon>
            <ListItemText>Upload Image</ListItemText>
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
    </FlexColContainer>
  );
};

export default RecipeView;
