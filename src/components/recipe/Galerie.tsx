import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MobileStepper,
  Paper
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { UseMutationResult } from '@tanstack/react-query';

type GalerieProps = {
  open: boolean;
  close: () => void;
  primaryImage: string;
  images: string[];
  changeMutation: UseMutationResult<Response, unknown, number, unknown>;
};

const Galerie: React.FunctionComponent<GalerieProps> = ({
  open,
  close,
  images,
  primaryImage,
  changeMutation
}: GalerieProps) => {
  const { t } = useTranslation(['common', 'recipe']);
  const [activeStep, setActiveStep] = useState(0);
  const allImages = [primaryImage, ...images];
  const maxSteps = allImages.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        {t('recipe:galery.title')}
        <IconButton sx={{ ml: 'auto' }} onClick={close}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
          <Paper
            square
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row-reverse',
              height: 50,
              pl: 2,
              bgcolor: 'background.default'
            }}
          >
            <Button
              disabled={activeStep === 0}
              onClick={() => {
                changeMutation.mutate(activeStep - 1);
                close();
              }}
            >
              {t('recipe:galery.primaryButton')}
            </Button>
          </Paper>
          <SwipeableViews
            axis="x"
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
          >
            {allImages.map((url, index) => (
              <div key={index}>
                {Math.abs(activeStep - index) <= 2 ? (
                  <Box
                    component="img"
                    sx={{
                      height: 255,
                      display: 'block',
                      maxWidth: 400,
                      overflow: 'hidden',
                      objectFit: 'cover',
                      width: '100%'
                    }}
                    src={url}
                  />
                ) : null}
              </div>
            ))}
          </SwipeableViews>
          <MobileStepper
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                {t('common:buttons.next')}
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                <KeyboardArrowLeft />
                {t('common:buttons.back')}
              </Button>
            }
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Galerie;
