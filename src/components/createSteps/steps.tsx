import { Button, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Grid from '@mui/system/Unstable_Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { centerStyle, gridOutline } from '../layout/commonSx';
import FlexColContainer from '../layout/FlexColContainer';
import { moveInArray } from '../../utils/arrayUtils';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddStep from './addStep';
import { useTranslation } from 'react-i18next';

const Steps: React.FunctionComponent = () => {
  const formContext = useFormContext();
  const [steps, setSteps] = useState<string[]>(formContext.getValues('steps') || []);

  const [open, setOpen] = useState<boolean>(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const { t } = useTranslation(['common', 'create']);

  const handleStepDelete = (toDelete: string) => {
    setSteps(steps.filter((step) => step !== toDelete));
  };

  const moveStep = (index: number, up: boolean) => {
    setSteps(moveInArray(steps, index, up));
  };

  useEffect(() => {
    formContext.setValue('steps', steps);
  }, [formContext, steps]);

  return (
    <FlexColContainer>
      <AddStep open={open} close={handleClose} updateData={setSteps} />
      {/* Actual UI */}
      <Button variant="outlined" onClick={handleOpen}>
        {t('create:stepDialog.formFields.submit')}
      </Button>

      <Typography m={1} variant="h6">
        {t('create:stepDialog.formFields.steps')}
      </Typography>
      <Grid container mt={1} sx={gridOutline}>
        {steps.map((step: string, index: number) => (
          <>
            <Grid xs={2} sm={1}>
              <Stack>
                <IconButton
                  size="small"
                  disabled={index === 0}
                  onClick={() => moveStep(index, true)}
                >
                  <KeyboardArrowUpIcon />
                </IconButton>
                <IconButton
                  size="small"
                  disabled={index === steps.length - 1}
                  onClick={() => moveStep(index, false)}
                >
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
    </FlexColContainer>
  );
};

export default Steps;
