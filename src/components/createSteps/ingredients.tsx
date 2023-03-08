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
import EditIcon from '@mui/icons-material/Edit';
import EditSection from './EditSection';
import { useTranslation } from 'react-i18next';

const Ingredients: React.FunctionComponent = () => {
    const formContext = useFormContext();
    const [ingredients, setIngredients] = useState<Ingredient[]>(formContext.getValues('ingredients') || []);
    const [sections, setSections] = useState<IngredientSection[]>(formContext.getValues('sections') || []);
    const [addOpen, setAddOpen] = useState<boolean>(false);
    const handleAddClose = () => setAddOpen(false);
    const handleAddOpen = () => setAddOpen(true);

    const [nameOpen, setNameOpen] = useState<boolean>(false);
    const handleNameClose = () => setNameOpen(false);
    const handleNameOpen = () => setNameOpen(true);
    const { t } = useTranslation(['common', 'create']);

    const [editSectionOpen, setEditSectionOpen] = useState<boolean[]>(Array(sections.length).fill(false));

    const handleIngredientDelete = (toDelete: Ingredient) => {
        setIngredients(ingredients.filter(ingredient => ingredient !== toDelete));
    };

    const handleSectionDelete = (toDelete: number) => {
        setSections(sections.filter((section, index) => index !== toDelete));
    };

    const handleSectionCreate = (sectionName: string) => {
        handleNameClose();
        console.log(sectionName);
        setSections(prevSections => [
            ...prevSections,
            {
                name: sectionName,
                items: ingredients,
            } as IngredientSection,
        ]);
        setIngredients([]);
    };

    const handleSectionUpdate = (value: IngredientSection, index: number) => {
        setSections(sections.map((item, arr_index) => (arr_index === index ? value : item)));
        setEditSectionOpen(editSectionOpen.map((item, arr_index) => (arr_index === index ? false : item)));
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
                {t('create:ingredientsDialog.buttons.add')}
            </Button>
            <Button variant="outlined" sx={{ mt: 1 }} disabled={ingredients.length === 0} onClick={handleNameOpen}>
                {t('create:ingredientsDialog.buttons.section')}
            </Button>

            <Grid container mt={1} sx={gridOutline}>
                <Grid xs={5} sx={centerStyle}>
                    <Typography>{t('create:ingredientsDialog.formFields.ingredient')}</Typography>
                </Grid>
                <Grid xs={5} sx={centerStyle}>
                    <Typography>{t('create:ingredientsDialog.formFields.amount')}</Typography>
                </Grid>
                <Grid xs={2} sx={centerStyle}>
                    <Typography>{t('create:ingredientsDialog.formFields.action')}</Typography>
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
                        <EditSection
                            open={editSectionOpen[index]}
                            close={() => setEditSectionOpen(editSectionOpen.map((item, arr_index) => (arr_index === index ? false : item)))}
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
                        <Grid container mt={1} sx={gridOutline}>
                            <Grid xs={6} sx={centerStyle}>
                                <Typography>{t('create:ingredientsDialog.formFields.ingredient')}</Typography>
                            </Grid>
                            <Grid xs={6} sx={centerStyle}>
                                <Typography>{t('create:ingredientsDialog.formFields.amount')}</Typography>
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
