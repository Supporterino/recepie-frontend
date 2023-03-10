import BasicInfos from '../components/createSteps/BasicInfos';
import Ingredients from '../components/createSteps/Ingredients';
import Steps from '../components/createSteps/Steps';
import {
  flexCol,
} from '../components/layout/commonSx';
import FlexColContainer from '../components/layout/FlexColContainer';
import sendRequest, {
  createRecipeUrl,
} from '../services/sendRequest';
import {
  type CreationData,
  type Ingredient,
  type IngredientSection,
} from '../types';
import {
  Box,
  Button,
  Grid,
  Step,
  StepButton,
  Stepper,
  Typography,
} from '@mui/material';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  useSnackbar,
} from 'notistack';
import React, {
  useState,
} from 'react';
import {
  type SubmitHandler,
} from 'react-hook-form';
import {
  FormProvider,
  useForm,
} from 'react-hook-form';
import {
  useTranslation,
} from 'react-i18next';

const steps = [
  'Basics',
  'Ingredients',
  'Steps',
];

type IFormData = {
  description: string,
  ingredients: Ingredient[],
  name: string,
  numberOfServings: number,
  sections: IngredientSection[],
  steps: string[],
  tags: string[],
};

const Create: React.FunctionComponent = () => {
  const [
    activeStep,
    setActiveStep,
  ] = useState(0);
  const queryClient = useQueryClient();
  const {
    enqueueSnackbar,
  } = useSnackbar();
  const {
    t,
  } = useTranslation([
    'common',
    'create',
  ]);

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
    setActiveStep((previousActiveStep) => {
      return previousActiveStep - 1;
    });
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

  const submitRecipeMutation = useMutation(
    (data: IFormData) => {
      return sendRequest(createRecipeUrl, 'POST', {
        description: data.description,
        ingredients: {
          numServings: Number(data.numberOfServings),
          ...data.sections.length > 0 ?
            {
              sections: data.sections,
            } :
            {
              items: data.ingredients,
            },
        },
        name: data.name,
        steps: data.steps,
        tags: data.tags,
      } as CreationData);
    },
    {
      onError: (error) => {
        enqueueSnackbar(`${t('create:snackbar.error')}${error}`, {
          variant: 'warning',
        });
      },
      onSuccess: () => {
        methods.reset();
        handleReset();
        enqueueSnackbar(t('create:snackbar.success'), {
          variant: 'success',
        });
        return queryClient.invalidateQueries([
          'recipes',
        ]);
      },
    },
  );

  const onSubmit: SubmitHandler<IFormData> = (data: IFormData) => {
    if (
      data.name !== '' &&
            data.description !== '' &&
            data.steps.length > 0 &&
            data.tags.length > 0 &&
            data.numberOfServings > 0 &&
            (data.ingredients.length > 0 || data.sections.length > 0)
    ) {
      submitRecipeMutation.mutate(data);
    } else {
      enqueueSnackbar(t('create:snackbar.missing'), {
        variant: 'error',
      });
    }
  };

  return (
    <FlexColContainer>
      <FormProvider {...methods}>
        <Box
          component='form'
          onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
            if (event.key === 'Enter') {
              event.preventDefault();
            }
          }}
          onSubmit={methods.handleSubmit(onSubmit)}
          sx={flexCol}
        >
          <Stepper
            activeStep={activeStep} sx={{
              m: 2,
            }}
          >
            {steps.map((name: string) => {
              return <Step key={`step-${name}`}>
                <StepButton>{name}</StepButton>
              </Step>;
            })}
          </Stepper>
          {renderStepContent(activeStep)}
          <Grid alignItems='center' columns={12} container justifyContent='space-evenly' spacing={0}>
            <Grid item xs={5}>
              <Button
                disabled={isFirstStep()} fullWidth onClick={handleBack}
                sx={{
                  mb: 2,
                  mt: 2,
                }} variant='contained'
              >
                {t('common:buttons.back')}
              </Button>
            </Grid>
            <Grid item xs={5}>
              {!isLastStep() &&
              <Button
                fullWidth onClick={handleNext} sx={{
                  mb: 2,
                  mt: 2,
                }}
                variant='contained'
              >
                {t('common:buttons.next')}
              </Button>}
              {isLastStep() &&
              <Button
                fullWidth sx={{
                  mb: 2,
                  mt: 2,
                }} type='submit'
                variant='contained'
              >
                {t('common:buttons.submit')}
              </Button>}
            </Grid>
          </Grid>
        </Box>
      </FormProvider>
    </FlexColContainer>
  );
};

export default Create;
