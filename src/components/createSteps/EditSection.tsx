import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { Ingredient, IngredientSection } from '../../types';
import {
  gridOutline,
  centerTopStyleCol,
  centerStyle,
  alignCenterJustifyCenter
} from '../layout/commonSx';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIngredient from './addIngredient';
import Flex from '../layout/Flex';
import { useTranslation } from 'react-i18next';

type EditSectionProps = {
  open: boolean;
  close: () => void;
  submit: (value: IngredientSection, index: number) => void;
  initialName: string;
  items: Ingredient[];
  index: number;
  mode: EditSectionMode;
};

type EditSectionMode = 'EDIT' | 'ADD';

const EditSection: React.FunctionComponent<EditSectionProps> = ({
  open,
  close,
  submit,
  initialName,
  items,
  index,
  mode
}: EditSectionProps) => {
  const [name, setName] = useState<string>(initialName);
  const [ingredients, setIngredients] = useState<Ingredient[]>(items);
  const [addIngredientOpen, setAddIngredientOpen] = useState<boolean>(false);
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const { t } = useTranslation(['common', 'create']);

  const handleIngredientDelete = (toDelete: Ingredient) => {
    setIngredients(ingredients.filter((ingredient) => ingredient !== toDelete));
  };

  const onSubmit = () => {
    submit({ name, items: ingredients } as IngredientSection, index);
  };

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>
        {mode === 'EDIT'
          ? t('create:ingredientsDialog.title.edit')
          : t('create:ingredientsDialog.title.add')}{' '}
        {t('create:ingredientsDialog.title.section')} - {name}
      </DialogTitle>
      <DialogContent>
        <AddIngredient
          open={addIngredientOpen}
          close={() => setAddIngredientOpen(false)}
          updateData={setIngredients}
        />
        <TextField
          required
          variant="outlined"
          fullWidth
          label={t('create:ingredientsDialog.formFields.name')}
          value={name}
          onChange={handleNameChange}
          sx={{ mt: 1 }}
        />
        <Grid container my={1} sx={gridOutline}>
          <Grid xs={4} sx={centerTopStyleCol}>
            <Typography sx={{ fontWeight: 'bold' }} ml={1}>
              {t('create:ingredientsDialog.formFields.amount')}
            </Typography>
          </Grid>
          <Grid xs={8} sx={centerTopStyleCol}>
            <Typography sx={{ fontWeight: 'bold' }} ml={1}>
              {t('create:ingredientsDialog.formFields.ingredient')}
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
        <Flex sx={alignCenterJustifyCenter}>
          <Button variant="contained" sx={{ my: 1 }} onClick={() => setAddIngredientOpen(true)}>
            {t('create:ingredientsDialog.buttons.add')}
          </Button>
        </Flex>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>{t('common:buttons.cancel')}</Button>
        <Button variant="contained" onClick={onSubmit}>
          {t('common:buttons.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSection;
