/* eslint-disable import/no-extraneous-dependencies */
import {
  moveInArray,
} from '../../utils/arrayUtils';
import {
  centerStyle,
  gridOutline,
} from '../layout/commonSx';
import FlexColContainer from '../layout/FlexColContainer';
import AddStep from './AddStep';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Button,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import {
  Fragment,
  useEffect,
  useState,
} from 'react';
import {
  useFormContext,
} from 'react-hook-form';
import {
  useTranslation,
} from 'react-i18next';

const Steps: React.FunctionComponent = () => {
  const formContext = useFormContext();
  const [
    steps,
    setSteps,
  ] = useState<string[]>(formContext.getValues('steps') || []);

  const [
    open,
    setOpen,
  ] = useState<boolean>(false);
  const handleClose = () => {
    return setOpen(false);
  };

  const handleOpen = () => {
    return setOpen(true);
  };

  const {
    t,
  } = useTranslation([
    'common',
    'create',
  ]);

  const handleStepDelete = (toDelete: string) => {
    setSteps(steps.filter((step) => {
      return step !== toDelete;
    }));
  };

  const moveStep = (index: number, up: boolean) => {
    setSteps(moveInArray(steps, index, up));
  };

  useEffect(() => {
    formContext.setValue('steps', steps);
  }, [
    formContext,
    steps,
  ]);

  return (
    <FlexColContainer>
      <AddStep close={handleClose} open={open} updateData={setSteps} />
      {/* Actual UI */}
      <Button onClick={handleOpen} variant='outlined'>
        {t('create:stepDialog.formFields.submit')}
      </Button>
      <Typography m={1} variant='h6'>
        {t('create:stepDialog.formFields.steps')}
      </Typography>
      <Grid container mt={1} sx={gridOutline}>
        {steps.map((step: string, index: number) => {
          return <Fragment key={step}>
            <Grid sm={1} xs={2}>
              <Stack>
                <IconButton
                  disabled={index === 0} onClick={() => {
                    return moveStep(index, true);
                  }} size='small'
                >
                  <KeyboardArrowUpIcon />
                </IconButton>
                <IconButton
                  disabled={index === steps.length - 1} onClick={() => {
                    return moveStep(index, false);
                  }} size='small'
                >
                  <KeyboardArrowDownIcon />
                </IconButton>
              </Stack>
            </Grid>
            <Grid key={`${step}-name`} sm={9} sx={centerStyle} xs={8}>
              <Typography>{step}</Typography>
            </Grid>
            <Grid key={`${step}-function`} sx={centerStyle} xs={2}>
              <IconButton
                onClick={() => {
                  handleStepDelete(step);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Fragment>;
        })}
      </Grid>
    </FlexColContainer>
  );
};

export default Steps;
