/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-extra-parens */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable unicorn/no-nested-ternary */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import useLoggedIn from '../../hooks/useLoggedIn';
import {
  authenticationManager,
} from '../../services/AuthenticationManager';
import {
  checkOwner,
  getRecipe,
} from '../../services/requests';
import sendRequest, {
  addCookListUrl,
  addFavoriteUrl,
  changePrimaryPictureUrl,
  deleteAdditionalPictureUrl,
  removeCookListUrl,
  removeFavoriteUrl,
} from '../../services/sendRequest';
import {
  type Ingredient,
  type IngredientSection,
  type Recipe,
} from '../../types';
import {
  PhotoTypes,
} from '../../types';
import ImageUpload from '../createSteps/ImageUpload';
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
import ErrorDisplay from '../queryUtils/ErrorDisplay';
import Loader from '../queryUtils/Loader';
import DeleteRecipe from './DeleteRecipe';
import Galerie from './Galerie';
import RecipeImage from './RecipeImage';
import Review from './Review';
import TagList from './TagList';
import {
  Share,
  Upload,
} from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PendingIcon from '@mui/icons-material/Pending';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Rating,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  useSnackbar,
} from 'notistack';
import {
  Fragment,
  useEffect,
  useState,
} from 'react';
import {
  useTranslation,
} from 'react-i18next';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

// eslint-disable-next-line complexity
const RecipeView: React.FunctionComponent = () => {
  const {
    id,
  } = useParams();
  const navigate = useNavigate();
  const {
    enqueueSnackbar,
  } = useSnackbar();
  const [
    uploadOpen,
    setUploadOpen,
  ] = useState<boolean>(false);
  const [
    deleteOpen,
    setDeleteOpen,
  ] = useState<boolean>(false);
  const [
    reviewOpen,
    setReviewOpen,
  ] = useState<boolean>(false);
  const [
    galeryOpen,
    setGaleryOpen,
  ] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const loggedIn = useLoggedIn();
  const {
    t,
  } = useTranslation([
    'common',
    'recipe',
  ]);

  if (!id) {
    navigate('/');
  }

  const {
    isLoading,
    isError,
    error,
    data: recipe,
  } = useQuery<Recipe>([
    'recipe',
    id,
  ], () => {
    return getRecipe(id!);
  });
  const [
    servings,
    setServings,
  ] = useState<number>(1);
  useEffect(() => {
    if (recipe) {
      setServings(recipe.ingredients.numServings);
    }
  }, [
    recipe,
  ]);

  const {
    data: isOwner,
  } = useQuery<boolean>([
    'isOwner',
    id,
  ], () => {
    return checkOwner(id!);
  }, {
    enabled: authenticationManager.hasUser(),
  });
  const owner = Boolean(isOwner);

  const [
    anchorElement,
    setAnchorElement,
  ] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorElement);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const share = async () => {
    try {
      await navigator.share({
        text: t('recipe:share.string').toString(),
        title: recipe?.name,
        url: `/recipe/${id}`,
      });
    } catch {
      enqueueSnackbar(t('recipe:share.error'), {
        variant: 'warning',
      });
    }
  };

  const favMutation = useMutation(
    () => (recipe!.isFavorite ? sendRequest(removeFavoriteUrl, 'DELETE', {
      recipeID: id,
    }) : sendRequest(addFavoriteUrl, 'POST', {
      recipeID: id,
    })),
    {
      onError: () => {
        enqueueSnackbar(t('recipe:snackbar.favError'), {
          variant: 'warning',
        });
      },
      onSuccess: () => {
        return Promise.all([
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
      },
    },
  );

  const cooklistMutation = useMutation(
    () => (recipe!.isCookList ? sendRequest(removeCookListUrl, 'DELETE', {
      recipeID: id,
    }) : sendRequest(addCookListUrl, 'POST', {
      recipeID: id,
    })),
    {
      onError: () => {
        enqueueSnackbar(t('recipe:snackbar.cooklistError'), {
          variant: 'warning',
        });
      },
      onSuccess: () => {
        return Promise.all([
          queryClient.invalidateQueries([
            'recipes',
          ]),
          queryClient.invalidateQueries([
            'cooklist',
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
      },
    },
  );

  const pictureChangeMutation = useMutation(
    (index: number) => {
      return sendRequest(changePrimaryPictureUrl, 'POST', {
        index,
        recipeID: id,
      });
    },
    {
      onError: () => {
        enqueueSnackbar(t('recipe:snackbar.cooklistError'), {
          variant: 'warning',
        });
      },
      onSuccess: () => {
        return Promise.all([
          queryClient.invalidateQueries([
            'recipes',
          ]),
          queryClient.invalidateQueries([
            'cooklist',
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
      },
    },
  );

  const deletePictureMutation = useMutation(
    (index: number) => {
      return sendRequest(deleteAdditionalPictureUrl, 'POST', {
        index,
        recipeID: id,
      });
    },
    {
      onError: () => {
        enqueueSnackbar(t('recipe:snackbar.cooklistError'), {
          variant: 'warning',
        });
      },
      onSuccess: () => {
        return Promise.all([
          queryClient.invalidateQueries([
            'recipes',
          ]),
          queryClient.invalidateQueries([
            'cooklist',
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
      },
    },
  );

  if (isLoading) {
    return (
      <FlexColContainer>
        <Loader />
      </FlexColContainer>
    );
  }

  if (isError) {
    return (
      <FlexColContainer>
        <ErrorDisplay text={`${error}`} />
      </FlexColContainer>
    );
  }

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
        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
      </Flex>
      <Flex>
        <RecipeImage
          additionalPictures={recipe.additionalPictures![0] !== '' && recipe.additionalPictures!.length > 0}
          height='100px'
          onClick={() => {
            if (recipe.additionalPictures![0] !== '' && recipe.additionalPictures!.length > 0) {
              setGaleryOpen(true);
            }
          }}
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
          <Typography variant='h5'>{recipe.name}</Typography>
          <Typography variant='body2'>
            {t('recipe:strings.by')} {recipe.owner.username}
          </Typography>
          <Flex
            onClick={() => {
              setReviewOpen(true);
            }}
            sx={alignCenterJustifyStart}
          >
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
      <Review
        close={() => {
          setReviewOpen(false);
        }}
        open={reviewOpen}
        recipeID={id!}
      />
      {recipe.additionalPictures![0] !== '' && recipe.additionalPictures!.length > 0 &&
      <Galerie
        changeMutation={pictureChangeMutation}
        close={() => {
          return setGaleryOpen(false);
        }}
        deleteMutation={deletePictureMutation}
        images={recipe.additionalPictures!}
        open={galeryOpen}
        primaryImage={recipe.picture}
      />}
      <Typography variant='h6'>{t('recipe:strings.description')}</Typography>
      <Typography mb={1} variant='body2'>
        {recipe.description}
      </Typography>
      <Typography variant='h6'>{t('recipe:strings.tags')}</Typography>
      <TagList initialTags={recipe.tags} />
      <Typography variant='h6'>{t('recipe:strings.ingredients')}</Typography>
      <Flex sx={{
        mt: 1,
        ...alignCenterJustifyCenter,
      }}
      >
        <IconButton
          disabled={servings === 1} onClick={() => {
            return setServings((previous) => {
              return previous - 1;
            });
          }} size='small'
        >
          <RemoveIcon />
        </IconButton>
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
          value={servings}
        />
        <IconButton
          onClick={() => {
            return setServings((previous) => {
              return previous + 1;
            });
          }} size='small'
        >
          <AddIcon />
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
        {recipe.ingredients.items?.map((ing: Ingredient) => {
          return <Fragment key={ing.name}>
            <Grid key={`${ing.name}-amount`} sx={centerTopStyleCol} xs={4}>
              <Typography ml={1}>
                {Math.round((ing.amount * (servings / recipe.ingredients.numServings) + Number.EPSILON) * 100) / 100}
                {ing.unit}
              </Typography>
            </Grid>
            <Grid key={`${ing.name}-name`} sx={centerTopStyleCol} xs={8}>
              <Typography ml={1}>{ing.name}</Typography>
            </Grid>
          </Fragment>;
        })}
        {recipe.ingredients.sections?.map((section: IngredientSection) => {
          return <Fragment key={section.name}>
            <Grid sx={centerStyle} xs={12}>
              <Typography
                my={0.2} sx={{
                  color: 'text.secondary',
                  fontWeight: 'bold',
                }}
              >
                {section.name}
              </Typography>
            </Grid>
            {section.items.map((ing: Ingredient) => {
              return <Fragment key={ing.name}>
                <Grid key={`${ing.name}-amount`} sx={centerTopStyleCol} xs={4}>
                  <Typography ml={1}>
                    {Math.round((ing.amount * (servings / recipe.ingredients.numServings) + Number.EPSILON) * 100) /
                                                100}
                    {ing.unit}
                  </Typography>
                </Grid>
                <Grid key={`${ing.name}-name`} sx={centerTopStyleCol} xs={8}>
                  <Typography ml={1}>{ing.name}</Typography>
                </Grid>
              </Fragment>;
            })}
          </Fragment>;
        })}
      </Grid>
      <Typography variant='h6'>{t('recipe:strings.steps')}</Typography>
      <Grid container my={1} sx={gridOutline}>
        {recipe.steps.map((step: string, index: number) => {
          return <Fragment key={step}>
            <Grid key={`${step}-key`} sx={centerStyle} xs={2}>
              <Typography>{index + 1}.</Typography>
            </Grid>
            <Grid key={`${step}-name`} sx={centerTopStyleCol} xs={10}>
              <Typography ml={1}>{step}</Typography>
            </Grid>
          </Fragment>;
        })}
      </Grid>
      <Menu
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorEl={anchorElement}
        id='basic-menu'
        onClose={handleClose}
        open={open}
      >
        <MenuItem onClick={share}>
          <ListItemIcon>
            <Share color='secondary' fontSize='small' />
          </ListItemIcon>
          <ListItemText>{t('recipe:strings.share')}</ListItemText>
        </MenuItem>
        {loggedIn &&
        <MenuItem
          onClick={() => {
            favMutation.mutate();
          }}
        >
          <ListItemIcon>
            {recipe.isFavorite && !favMutation.isLoading && <FavoriteIcon color='error' fontSize='small' />}
            {!recipe.isFavorite && !favMutation.isLoading && <FavoriteBorderIcon color='secondary' fontSize='small' />}
            {favMutation.isLoading && <PendingIcon color='secondary' fontSize='small' />}
          </ListItemIcon>
          <ListItemText>
            {favMutation.isLoading ?
              t('common:buttons.pending') :
              recipe.isFavorite ?
                t('recipe:menuItems.rmFav') :
                t('recipe:menuItems.addFav')}
          </ListItemText>
        </MenuItem>}
        {loggedIn &&
        <MenuItem
          onClick={() => {
            cooklistMutation.mutate();
          }}
        >
          <ListItemIcon>
            {recipe.isCookList && !cooklistMutation.isLoading && <BookmarkIcon color='primary' fontSize='small' />}
            {!recipe.isCookList && !cooklistMutation.isLoading && <BookmarkBorderIcon color='secondary' fontSize='small' />}
            {cooklistMutation.isLoading && <PendingIcon color='secondary' fontSize='small' />}
          </ListItemIcon>
          <ListItemText>
            {cooklistMutation.isLoading ?
              t('common:buttons.pending') :
              recipe.isCookList ?
                t('recipe:menuItems.rmCooklist') :
                t('recipe:menuItems.addCooklist')}
          </ListItemText>
        </MenuItem>}
        {owner &&
        <MenuItem
          onClick={() => {
            setUploadOpen(true);
          }}
        >
          <ListItemIcon>
            <Upload color='secondary' fontSize='small' />
          </ListItemIcon>
          <ListItemText>{t('recipe:menuItems.uploadImage')}</ListItemText>
        </MenuItem>}
        {owner &&
        <MenuItem
          onClick={() => {
            navigate(`/edit/${id}`, {
              state: recipe,
            });
          }}
        >
          <ListItemIcon>
            <EditIcon color='secondary' fontSize='small' />
          </ListItemIcon>
          <ListItemText>{t('recipe:menuItems.edit')}</ListItemText>
        </MenuItem>}
        {owner &&
        <MenuItem
          onClick={() => {
            setDeleteOpen(true);
          }}
        >
          <ListItemIcon>
            <DeleteIcon color='error' fontSize='small' />
          </ListItemIcon>
          <ListItemText>{t('recipe:menuItems.delete')}</ListItemText>
        </MenuItem>}
      </Menu>
      {owner &&
      <ImageUpload
        close={() => {
          setUploadOpen(false);
        }}
        open={uploadOpen}
        recipeID={id!}
        target={recipe.picture === '' ? PhotoTypes.RECIPE : PhotoTypes.ADDITION_RECIPE}
      />}
      {owner &&
      <DeleteRecipe
        close={() => {
          setDeleteOpen(false);
        }}
        open={deleteOpen}
        recipeID={id!}
      />}
    </FlexColContainer>
  );
};

export default RecipeView;
