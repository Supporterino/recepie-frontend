import { Box, Button, Grid, Step, StepButton, Stepper, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import BasicInfos from '../components/createSteps/basicInfos';
import Ingredients from '../components/createSteps/ingredients';
import Steps from '../components/createSteps/steps';
import { flexCol } from '../components/layout/commonSx';
import FlexColContainer from '../components/layout/FlexColContainer';
import sendRequest, { createRecipeUrl } from '../services/requestService';
import { CreationData, Ingredient, IngredientSection } from '../types';

const steps = ['Basics', 'Ingredients', 'Steps'];

type IFormData = {
    name: string;
    description: string;
    numberOfServings: number;
    tags: string[];
    ingredients: Ingredient[];
    sections: IngredientSection[];
    steps: string[];
};

const Create: React.FunctionComponent = () => {
    const [activeStep, setActiveStep] = useState(0);
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation(['common', 'create']);

    const totalSteps = () => {
        return steps.length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const isFirstStep = () => {
        return activeStep === 0;
    };

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const methods = useForm<IFormData>();

    const renderStepContent = (step: number): JSX.Element => {
        switch (step) {
            case 0:
                return <BasicInfos />;
            case 1:
                return <Ingredients />;
            case 2:
                return <Steps />;
            default:
                return (
                    <FlexColContainer>
                        <Typography>{t('create:broken')}</Typography>
                    </FlexColContainer>
                );
        }
    };

    const onSubmit: SubmitHandler<IFormData> = (data: IFormData) => {
        if (
            data.name !== '' &&
            data.description !== '' &&
            data.steps.length > 0 &&
            data.tags.length > 0 &&
            data.numberOfServings > 0 &&
            (data.ingredients.length > 0 || data.sections.length > 0)
        )
            submitRecipeMutation.mutate(data);
        else enqueueSnackbar(t('create:snackbar.missing'), { variant: 'error' });
    };

    const submitRecipeMutation = useMutation(
        (data: IFormData) =>
            sendRequest(createRecipeUrl, 'POST', {
                name: data.name,
                description: data.description,
                steps: data.steps,
                tags: data.tags,
                ingredients: {
                    numServings: +data.numberOfServings,
                    ...(data.sections.length > 0
                        ? {
                              sections: data.sections,
                          }
                        : { items: data.ingredients }),
                },
            } as CreationData),
        {
            onSuccess: () => {
                methods.reset();
                handleReset();
                enqueueSnackbar(t('create:snackbar.success'), { variant: 'success' });
                return queryClient.invalidateQueries(['recipes']);
            },
            onError: (error, variables, context) => {
                enqueueSnackbar(`${t('create:snackbar.error')}${error}`, { variant: 'warning' });
            },
        },
    );

    return (
        <FlexColContainer>
            <FormProvider {...methods}>
                <Box
                    component="form"
                    sx={flexCol}
                    onSubmit={methods.handleSubmit(onSubmit)}
                    onKeyPress={(e: React.KeyboardEvent<HTMLFormElement>) => {
                        if (e.key === 'Enter') e.preventDefault();
                    }}
                >
                    <Stepper activeStep={activeStep} sx={{ m: 2 }}>
                        {steps.map((name: string, index: number) => (
                            <Step key={index}>
                                <StepButton>{name}</StepButton>
                            </Step>
                        ))}
                    </Stepper>
                    {renderStepContent(activeStep)}
                    <Grid container justifyContent="space-evenly" alignItems="center" spacing={0} columns={12}>
                        <Grid item xs={5}>
                            <Button onClick={handleBack} fullWidth variant="contained" sx={{ mt: 2, mb: 2 }} disabled={isFirstStep()}>
                                {t('common:buttons.back')}
                            </Button>
                        </Grid>
                        <Grid item xs={5}>
                            {!isLastStep() && (
                                <Button onClick={handleNext} fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
                                    {t('common:buttons.next')}
                                </Button>
                            )}
                            {isLastStep() && (
                                <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
                                    {t('common:buttons.submit')}
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </FormProvider>
        </FlexColContainer>
    );
};

export default Create;
