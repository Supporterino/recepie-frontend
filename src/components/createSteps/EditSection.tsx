import {
  type Ingredient,
  type IngredientSection,
} from '../../types';
import {
  alignCenterJustifyCenter,
  centerStyle,
  centerTopStyleCol,
  gridOutline,
} from '../layout/commonSx';
import Flex from '../layout/Flex';
import AddIngredient from './AddIngredient';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import {
  type ChangeEvent,
  Fragment,
} from 'react';
import {
  useState,
} from 'react';
import {
  useTranslation,
} from 'react-i18next';

type EditSectionProps = {
  close: () => void,
  index: number,
  initialName: string,
  items: Ingredient[],
  mode: EditSectionMode,
  open: boolean,
  submit: (value: IngredientSection, index: number) => void,
};

type EditSectionMode = 'ADD' | 'EDIT';

const EditSection: React.FunctionComponent<EditSectionProps> = ({
  open,
  close,
  submit,
  initialName,
  items,
  index,
  mode,
}: EditSectionProps) => {
  const [
    name,
    setName,
  ] = useState<string>(initialName);
  const [
    ingredients,
    setIngredients,
  ] = useState<Ingredient[]>(items);
  const [
    addIngredientOpen,
    setAddIngredientOpen,
  ] = useState<boolean>(false);
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const {
    t,
  } = useTranslation([
    'common',
    'create',
  ]);

  const handleIngredientDelete = (toDelete: Ingredient) => {
    setIngredients(ingredients.filter((ingredient) => {
      return ingredient !== toDelete;
    }));
  };

  const onSubmit = () => {
    submit({
      items: ingredients,
      name,
    } as IngredientSection, index);
  };

  return (
    <Dialog onClose={close} open={open}>
      <DialogTitle>
        {mode === 'EDIT' ? t('create:ingredientsDialog.title.edit') : t('create:ingredientsDialog.title.add')}{' '}
        {t('create:ingredientsDialog.title.section')} - {name}
      </DialogTitle>
      <DialogContent>
        <AddIngredient
          close={() => {
            return setAddIngredientOpen(false);
          }} open={addIngredientOpen} updateData={setIngredients}
        />
        <TextField
          fullWidth
          label={t('create:ingredientsDialog.formFields.name')}
          onChange={handleNameChange}
          required
          sx={{
            mt: 1,
          }}
          value={name}
          variant='outlined'
        />
        <Grid container my={1} sx={gridOutline}>
          <Grid sx={centerTopStyleCol} xs={4}>
            <Typography
              ml={1} sx={{
                fontWeight: 'bold',
              }}
            >
              {t('create:ingredientsDialog.formFields.amount')}
            </Typography>
          </Grid>
          <Grid sx={centerTopStyleCol} xs={8}>
            <Typography
              ml={1} sx={{
                fontWeight: 'bold',
              }}
            >
              {t('create:ingredientsDialog.formFields.ingredient')}
            </Typography>
          </Grid>
          {ingredients.map((ing: Ingredient) => {
            return <Fragment key={ing.name}>
              <Grid key={`${ing.name}-amount`} sx={centerTopStyleCol} xs={4}>
                <Typography ml={1}>
                  {ing.amount} {ing.unit}
                </Typography>
              </Grid>
              <Grid key={`${ing.name}-name`} sx={centerTopStyleCol} xs={6}>
                <Typography ml={1}>{ing.name}</Typography>
              </Grid>
              <Grid key={`${ing.name}-function`} sx={centerStyle} xs={2}>
                <IconButton
                  onClick={() => {
                    handleIngredientDelete(ing);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Fragment>;
          })}
        </Grid>
        <Flex sx={alignCenterJustifyCenter}>
          <Button
            onClick={() => {
              return setAddIngredientOpen(true);
            }} sx={{
              my: 1,
            }} variant='contained'
          >
            {t('create:ingredientsDialog.buttons.add')}
          </Button>
        </Flex>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>{t('common:buttons.cancel')}</Button>
        <Button onClick={onSubmit} variant='contained'>
          {t('common:buttons.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSection;
