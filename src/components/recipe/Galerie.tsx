import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MobileStepper,
  Paper,
} from '@mui/material';
import {
  type UseMutationResult,
} from '@tanstack/react-query';
import {
  useState,
} from 'react';
import {
  useTranslation,
} from 'react-i18next';
import SwipeableViews from 'react-swipeable-views';

type GalerieProps = {
  changeMutation: UseMutationResult<Response, unknown, number, unknown>,
  close: () => void,
  deleteMutation: UseMutationResult<Response, unknown, number, unknown>,
  images: string[],
  open: boolean,
  primaryImage: string,
};

const Galerie: React.FunctionComponent<GalerieProps> = ({
  open,
  close,
  images,
  primaryImage,
  changeMutation,
  deleteMutation,
}: GalerieProps) => {
  const {
    t,
  } = useTranslation([
    'common',
    'recipe',
  ]);
  const [
    activeStep,
    setActiveStep,
  ] = useState(0);
  const allImages = [
    primaryImage,
    ...images,
  ];
  const maxSteps = allImages.length;

  const handleNext = () => {
    setActiveStep((previousActiveStep) => {
      return previousActiveStep + 1;
    });
  };

  const handleBack = () => {
    setActiveStep((previousActiveStep) => {
      return previousActiveStep - 1;
    });
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Dialog onClose={close} open={open}>
      <DialogTitle sx={{
        alignItems: 'center',
        display: 'flex',
      }}
      >
        {t('recipe:galery.title')}
        <IconButton
          onClick={close} sx={{
            ml: 'auto',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{
          flexGrow: 1,
          maxWidth: 400,
        }}
        >
          <Paper
            elevation={0}
            square
            sx={{
              alignItems: 'center',
              bgcolor: 'background.default',
              display: 'flex',
              flexDirection: 'row',
              height: 50,
              pl: 2,
            }}
          >
            <IconButton
              disabled={activeStep === 0}
              onClick={() => {
                deleteMutation.mutate(activeStep - 1);
                close();
              }}
              sx={{
                mr: 'auto',
              }}
            >
              <DeleteIcon />
            </IconButton>
            <Button
              disabled={activeStep === 0}
              onClick={() => {
                changeMutation.mutate(activeStep - 1);
                close();
              }}
              sx={{
                mr: 1,
              }}
            >
              {t('recipe:galery.primaryButton')}
            </Button>
          </Paper>
          <SwipeableViews axis='x' enableMouseEvents index={activeStep} onChangeIndex={handleStepChange}>
            {allImages.map((url, index) => {
              return <div key={url}>
                {Math.abs(activeStep - index) <= 2 ?
                  <Box
                    component='img'
                    src={url}
                    sx={{
                      display: 'block',
                      height: 255,
                      maxWidth: 400,
                      objectFit: 'cover',
                      overflow: 'hidden',
                      width: '100%',
                    }}
                  /> :
                  null}
              </div>;
            })}
          </SwipeableViews>
          <MobileStepper
            activeStep={activeStep}
            backButton={
              <Button disabled={activeStep === 0} onClick={handleBack} size='small'>
                <KeyboardArrowLeft />
                {t('common:buttons.back')}
              </Button>
            }
            nextButton={
              <Button disabled={activeStep === maxSteps - 1} onClick={handleNext} size='small'>
                {t('common:buttons.next')}
                <KeyboardArrowRight />
              </Button>
            }
            position='static'
            steps={maxSteps}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Galerie;
