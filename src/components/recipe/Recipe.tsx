import { Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Rating, TextField, Typography } from '@mui/material';
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
    addCookListUrl,
    changePrimaryPictureUrl,
    deleteAdditionalPictureUrl,
} from '../../services/requestService';
import { Recipe, Ingredient, IngredientSection, PhotoTypes } from '../../types';
import ImageUpload from '../createSteps/imageUpload';
import { alignCenterJustifyStart, alignCenterJustifyCenter, gridOutline, centerTopStyleCol, centerStyle } from '../layout/commonSx';
import Flex from '../layout/Flex';
import FlexCol from '../layout/FlexCol';
import FlexColContainer from '../layout/FlexColContainer';
import ErrorDisplay from '../queryUtils/ErrorText';
import Loader from '../queryUtils/Loader';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteRecipe from './DeleteRecipe';
import Review from './Rating';
import RecipeImage from './RecipeImage';
import { useTranslation } from 'react-i18next';
import TagList from './TagList';
import Galerie from './Galerie';

const RecipeView: React.FunctionComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [uploadOpen, setUploadOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [reviewOpen, setReviewOpen] = useState<boolean>(false);
    const [galeryOpen, setGaleryOpen] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const loggedIn = useLoggedIn();
    const { t } = useTranslation(['common', 'recipe']);

    if (!id) navigate('/');

    const { isLoading, isError, error, data: recipe } = useQuery<Recipe>(['recipe', id], () => getRecipe(id!));
    const [servings, setServings] = useState<number>(1);
    useEffect(() => {
        if (recipe) setServings(recipe.ingredients.numServings);
    }, [recipe]);

    const { data: isOwner } = useQuery<boolean>(['isOwner', id], () => checkOwner(id!), {
        enabled: authenticationManager.hasUser(),
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
                title: recipe?.name,
                text: t('recipe:share.string'),
            });
        } catch (error) {
            enqueueSnackbar(t('recipe:share.error'), { variant: 'warning' });
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
                    queryClient.invalidateQueries(['ownRecipes']),
                ]);
            },
            onError: (error, variables, context) => {
                enqueueSnackbar(t('recipe:snackbar.favError'), { variant: 'warning' });
            },
        },
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
                    queryClient.invalidateQueries(['ownRecipes']),
                ]);
            },
            onError: (error, variables, context) => {
                enqueueSnackbar(t('recipe:snackbar.cooklistError'), { variant: 'warning' });
            },
        },
    );

    const pictureChangeMutation = useMutation(
        (index: number) => sendRequest(changePrimaryPictureUrl, 'POST', { recipeID: id, index: index }),
        {
            onSuccess: () => {
                return Promise.all([
                    queryClient.invalidateQueries(['recipes']),
                    queryClient.invalidateQueries(['cooklist']),
                    queryClient.invalidateQueries(['lists']),
                    queryClient.invalidateQueries(['recipe', id]),
                    queryClient.invalidateQueries(['ownRecipes']),
                ]);
            },
            onError: (error, variables, context) => {
                enqueueSnackbar(t('recipe:snackbar.cooklistError'), { variant: 'warning' });
            },
        },
    );

    const deletePictureMutation = useMutation(
        (index: number) => sendRequest(deleteAdditionalPictureUrl, 'POST', { recipeID: id, index: index }),
        {
            onSuccess: () => {
                return Promise.all([
                    queryClient.invalidateQueries(['recipes']),
                    queryClient.invalidateQueries(['cooklist']),
                    queryClient.invalidateQueries(['lists']),
                    queryClient.invalidateQueries(['recipe', id]),
                    queryClient.invalidateQueries(['ownRecipes']),
                ]);
            },
            onError: (error, variables, context) => {
                enqueueSnackbar(t('recipe:snackbar.cooklistError'), { variant: 'warning' });
            },
        },
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
                    onClick={() => {
                        if (recipe.additionalPictures![0] !== '' && recipe.additionalPictures!.length > 0) setGaleryOpen(true);
                    }}
                    additionalPictures={recipe.additionalPictures![0] !== '' && recipe.additionalPictures!.length > 0}
                />
                <FlexCol sx={{ justifyContent: 'space-evenly' }}>
                    <Typography variant="h5">{recipe.name}</Typography>
                    <Typography variant="body2">
                        {t('recipe:strings.by')} {recipe.owner.username}
                    </Typography>
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

            {recipe.additionalPictures![0] !== '' && recipe.additionalPictures!.length > 0 && (
                <Galerie
                    open={galeryOpen}
                    close={() => setGaleryOpen(false)}
                    primaryImage={recipe.picture}
                    images={recipe.additionalPictures!}
                    changeMutation={pictureChangeMutation}
                    deleteMutation={deletePictureMutation}
                />
            )}

            <Typography variant="h6">{t('recipe:strings.description')}</Typography>
            <Typography variant="body2" mb={1}>
                {recipe.description}
            </Typography>
            <Typography variant="h6">{t('recipe:strings.tags')}</Typography>
            <TagList initialTags={recipe.tags} />

            <Typography variant="h6">{t('recipe:strings.ingredients')}</Typography>
            <Flex sx={{ mt: 1, ...alignCenterJustifyCenter }}>
                <IconButton size="small" disabled={servings === 1} onClick={() => setServings(prev => prev - 1)}>
                    <RemoveIcon />
                </IconButton>
                <TextField
                    size="small"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    label={t('recipe:strings.servings')}
                    onChange={event => setServings(+event.target.value)}
                    value={servings}
                />
                <IconButton size="small" onClick={() => setServings(prev => prev + 1)}>
                    <AddIcon />
                </IconButton>
            </Flex>

            <Grid container my={1} sx={gridOutline}>
                <Grid xs={4} sx={centerTopStyleCol}>
                    <Typography sx={{ fontWeight: 'bold' }} ml={1}>
                        {t('recipe:strings.amount')}
                    </Typography>
                </Grid>
                <Grid xs={8} sx={centerTopStyleCol}>
                    <Typography sx={{ fontWeight: 'bold' }} ml={1}>
                        {t('recipe:strings.ingredient')}
                    </Typography>
                </Grid>
                {recipe.ingredients.items &&
                    recipe.ingredients.items.map((ing: Ingredient, index: number) => (
                        <>
                            <Grid xs={4} key={`${index}-amount`} sx={centerTopStyleCol}>
                                <Typography ml={1}>
                                    {Math.round((ing.amount * (servings / recipe.ingredients.numServings) + Number.EPSILON) * 100) / 100}
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
                                            {Math.round((ing.amount * (servings / recipe.ingredients.numServings) + Number.EPSILON) * 100) /
                                                100}
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

            <Typography variant="h6">{t('recipe:strings.steps')}</Typography>
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
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={share}>
                    <ListItemIcon>
                        <Share fontSize="small" color="secondary" />
                    </ListItemIcon>
                    <ListItemText>{t('recipe:strings.share')}</ListItemText>
                </MenuItem>
                {loggedIn && (
                    <MenuItem
                        onClick={() => {
                            favMutation.mutate();
                        }}
                    >
                        <ListItemIcon>
                            {recipe.isFavorite && !favMutation.isLoading && <FavoriteIcon color="error" fontSize="small" />}
                            {!recipe.isFavorite && !favMutation.isLoading && <FavoriteBorderIcon color="secondary" fontSize="small" />}
                            {favMutation.isLoading && <PendingIcon color="secondary" fontSize="small" />}
                        </ListItemIcon>
                        <ListItemText>
                            {favMutation.isLoading
                                ? t('common:buttons.pending')
                                : recipe.isFavorite
                                ? t('recipe:menuItems.rmFav')
                                : t('recipe:menuItems.addFav')}
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
                            {recipe.isCookList && !cooklistMutation.isLoading && <BookmarkIcon color="primary" fontSize="small" />}
                            {!recipe.isCookList && !cooklistMutation.isLoading && <BookmarkBorderIcon color="secondary" fontSize="small" />}
                            {cooklistMutation.isLoading && <PendingIcon color="secondary" fontSize="small" />}
                        </ListItemIcon>
                        <ListItemText>
                            {cooklistMutation.isLoading
                                ? t('common:buttons.pending')
                                : recipe.isCookList
                                ? t('recipe:menuItems.rmCooklist')
                                : t('recipe:menuItems.addCooklist')}
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
                        <ListItemText>{t('recipe:menuItems.uploadImage')}</ListItemText>
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
                        <ListItemText>{t('recipe:menuItems.edit')}</ListItemText>
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
                        <ListItemText>{t('recipe:menuItems.delete')}</ListItemText>
                    </MenuItem>
                )}
            </Menu>
            {owner && (
                <ImageUpload
                    open={uploadOpen}
                    close={() => {
                        setUploadOpen(false);
                    }}
                    target={recipe.picture === '' ? PhotoTypes.RECIPE : PhotoTypes.ADDITION_RECIPE}
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
