import { Box, Button, Fab, IconButton, Rating, Stack, TextField, Typography } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Ingredient, IngredientSection, Recipe } from '../../types';
import Flex from '../layout/Flex';
import FlexCol from '../layout/FlexCol';
import FlexColContainer from '../layout/FlexColContainer';
import Grid from '@mui/system/Unstable_Grid';
import { alignCenterJustifyCenter, alignCenterJustifyStart, centerStyle, centerTopStyleCol, gridOutline } from '../layout/commonSx';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { moveInArray } from '../../utils/arrayUtils';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddStep from '../createSteps/addStep';
import AddIngredient from '../createSteps/addIngredient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import sendRequest, { editRecipeUrl } from '../../services/requestService';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import EditSection from '../createSteps/EditSection';
import RecipeImage from './RecipeImage';
import { useTranslation } from 'react-i18next';
import TagList from './TagList';

const EditRecipeView: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const { id } = useParams();
    const { state } = useLocation();
    const recipe = state as Recipe;
    const { t } = useTranslation(['common', 'recipe']);

    if (!id) navigate('/');

    const [servings, setServings] = useState<number>(recipe.ingredients.numServings);
    const [ingredients, setIngredients] = useState<Ingredient[]>(recipe.ingredients.items || []);
    const [sections, setSections] = useState<IngredientSection[]>(recipe.ingredients.sections || []);
    const [steps, setSteps] = useState<string[]>(recipe.steps);
    const [description, setDescription] = useState<string>(recipe.description);
    const [name, setName] = useState<string>(recipe.name);
    const [tags, setTags] = useState<Array<string>>(recipe.tags);

    const handleIngredientDelete = (toDelete: Ingredient) => {
        setIngredients(ingredients.filter(ingredient => ingredient !== toDelete));
    };

    const handleStepDelete = (toDelete: string) => {
        setSteps(steps.filter(step => step !== toDelete));
    };

    const moveStep = (index: number, up: boolean) => {
        setSteps(moveInArray(steps, index, up));
    };

    const [addStepOpen, setAddStepOpen] = useState<boolean>(false);
    const [addIngredientOpen, setAddIngredientOpen] = useState<boolean>(false);
    const [editSectionOpen, setEditSectionOpen] = useState<boolean[]>(Array(sections.length).fill(false));
    const [addSectionOpen, setAddSectionOpen] = useState<boolean>(false);

    const handleSectionDelete = (toDelete: number) => {
        setSections(sections.filter((section, index) => index !== toDelete));
    };

    const handleSectionUpdate = (value: IngredientSection, index: number) => {
        setSections(sections.map((item, arr_index) => (arr_index === index ? value : item)));
        setEditSectionOpen(editSectionOpen.map((item, arr_index) => (arr_index === index ? false : item)));
    };

    const handleSectionAdd = (value: IngredientSection, index: number) => {
        setEditSectionOpen([...editSectionOpen, false]);
        setSections([...sections, value]);
        setAddSectionOpen(false);
    };

    const editMutation = useMutation(
        () =>
            sendRequest(editRecipeUrl, 'POST', {
                id,
                name,
                description,
                ingredients: {
                    numServings: servings,
                    ...(sections.length > 0
                        ? {
                              sections: sections,
                          }
                        : { items: ingredients }),
                },
                steps,
                tags,
            }),
        {
            onSuccess: async () => {
                await Promise.all([
                    queryClient.invalidateQueries(['recipes']),
                    queryClient.invalidateQueries(['ownFavorites']),
                    queryClient.invalidateQueries(['lists']),
                    queryClient.invalidateQueries(['recipe', id]),
                    queryClient.invalidateQueries(['ownRecipes']),
                ]);
                return navigate(`/recipe/${id}`, { replace: true });
            },
            onError: (error, variables, context) => {
                enqueueSnackbar(t('recipe:editView.error'), { variant: 'error' });
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
                <Box sx={{ flexGrow: 1 }} />
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
                    <TextField fullWidth label={t('recipe:strings.name')} value={name} onChange={event => setName(event.target.value)} />
                    <Typography variant="body2">
                        {t('recipe:strings.by')} {recipe.owner.username}
                    </Typography>
                    <Flex sx={alignCenterJustifyStart}>
                        <Rating value={recipe.rating.avgRating} readOnly precision={0.5} />
                        <Typography sx={{ color: 'text.secondary' }} variant="body2" ml={0.5}>
                            ({recipe.rating.numOfRatings})
                        </Typography>
                    </Flex>
                </FlexCol>
            </Flex>

            <Typography variant="h6">{t('recipe:strings.description')}</Typography>
            <TextField
                size="small"
                fullWidth
                label={t('recipe:strings.description')}
                multiline
                value={description}
                onChange={event => setDescription(event.target.value)}
                sx={{ my: 1 }}
            />

            <Typography variant="h6">{t('recipe:strings.tags')}</Typography>
            <TagList initialTags={tags} editable updateHook={setTags} />

            <Typography variant="h6">{t('recipe:strings.ingredients')}</Typography>
            <Flex sx={{ mt: 1, ...alignCenterJustifyCenter }}>
                <TextField
                    size="small"
                    type="number"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    label={t('recipe:strings.servings')}
                    onChange={event => setServings(+event.target.value)}
                    value={servings}
                />
            </Flex>
            <AddIngredient open={addIngredientOpen} close={() => setAddIngredientOpen(false)} updateData={setIngredients} />

            {ingredients.length > 0 && (
                <>
                    <Button variant="outlined" sx={{ my: 1 }} onClick={() => setAddIngredientOpen(true)}>
                        {t('recipe:editView.addIngredient')}
                    </Button>
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
                </>
            )}

            {sections.length > 0 && (
                <>
                    <Button variant="outlined" sx={{ my: 1 }} onClick={() => setAddSectionOpen(true)}>
                        {t('recipe:editView.addSection')}
                    </Button>
                    <EditSection
                        open={addSectionOpen}
                        close={() => setAddSectionOpen(false)}
                        submit={handleSectionAdd}
                        initialName={''}
                        items={[]}
                        index={-1}
                        mode={'ADD'}
                    />
                    {sections.map((section: IngredientSection, index: number) => (
                        <>
                            <EditSection
                                open={editSectionOpen[index]}
                                close={() =>
                                    setEditSectionOpen(editSectionOpen.map((item, arr_index) => (arr_index === index ? false : item)))
                                }
                                submit={handleSectionUpdate}
                                initialName={section.name}
                                items={section.items}
                                index={index}
                                mode={'EDIT'}
                            />
                            <Flex sx={{ mt: 1, ...alignCenterJustifyCenter }}>
                                <Typography sx={{ flexGrow: 1 }} variant="h6">
                                    {section.name}
                                </Typography>
                                <IconButton
                                    onClick={() =>
                                        setEditSectionOpen(editSectionOpen.map((item, arr_index) => (arr_index === index ? true : item)))
                                    }
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
                                {section.items.map((ing: Ingredient, index: number) => (
                                    <>
                                        <Grid xs={4} key={`${index}-amount`} sx={centerTopStyleCol}>
                                            <Typography ml={1}>
                                                {Math.round(
                                                    (ing.amount * (servings / recipe.ingredients.numServings) + Number.EPSILON) * 100,
                                                ) / 100}
                                                {ing.unit}
                                            </Typography>
                                        </Grid>
                                        <Grid xs={8} key={`${index}-name`} sx={centerTopStyleCol}>
                                            <Typography ml={1}>{ing.name}</Typography>
                                        </Grid>
                                    </>
                                ))}
                            </Grid>
                        </>
                    ))}
                </>
            )}

            <Typography variant="h6">{t('recipe:strings.steps')}</Typography>
            <AddStep open={addStepOpen} close={() => setAddStepOpen(false)} updateData={setSteps} />
            <Button variant="outlined" sx={{ my: 1 }} onClick={() => setAddStepOpen(true)}>
                {t('recipe:editView.addStep')}
            </Button>
            <Grid container my={1} sx={gridOutline}>
                {steps.map((step: string, index: number) => (
                    <>
                        <Grid xs={2} sm={1}>
                            <Stack>
                                <IconButton size="small" disabled={index === 0} onClick={() => moveStep(index, true)}>
                                    <KeyboardArrowUpIcon />
                                </IconButton>
                                <IconButton size="small" disabled={index === steps.length - 1} onClick={() => moveStep(index, false)}>
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
                    right: 36,
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
