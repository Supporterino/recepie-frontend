import {
  type AllMeasures,
  type AllMeasuresUnits,
  type Ingredient,
} from '../../types';
import {
  allMeasures,
  initConverter,
} from '../../types';
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  TextField,
} from '@mui/material';
import {
  useSnackbar,
} from 'notistack';
import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {
  useRef,
  useState,
} from 'react';
import {
  useTranslation,
} from 'react-i18next';

type AddIngredientProps = {
  close: () => void,
  open: boolean,
  updateData: Dispatch<SetStateAction<Ingredient[]>>,
};

const AddIngredient: React.FunctionComponent<AddIngredientProps> = ({
  open,
  close,
  updateData,
}: AddIngredientProps) => {
  const {
    enqueueSnackbar,
  } = useSnackbar();
  const [
    leaveOpen,
    setLeaveOpen,
  ] = useState<boolean>(false);
  const {
    t,
  } = useTranslation([
    'common',
    'create',
  ]);

  const [
    name,
    setName,
  ] = useState<string>();
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const [
    amount,
    setAmount,
  ] = useState<number>();
  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(event.target.value));
  };

  const [
    unit,
    setUnit,
  ] = useState<{ category: string, unit: AllMeasuresUnits, }>();
  const handleUnitChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: {
      category: string,
      unit: AllMeasuresUnits,
    } | null,
  ) => {
    if (value) {
      setUnit(value);
    }
  };

  const allConverter = initConverter(allMeasures)();

  const options: Array<{ category: string, unit: AllMeasuresUnits, }> = [];
  [
    'mass',
    'volume',
    'each',
  // eslint-disable-next-line unicorn/no-array-for-each
  ].forEach((option: string) => {
    for (const possibleUnit of allConverter.possibilities(option as AllMeasures)) {
      options.push({
        category: option,
        unit: possibleUnit,
      });
    }
  });

  const inputRefUnit = useRef<HTMLInputElement>(null);
  const inputRefName = useRef<HTMLInputElement>(null);
  const inputRefAmount = useRef<HTMLInputElement>(null);

  const onSubmit = () => {
    if (name && amount && unit) {
      updateData((previousIngredients) => {
        return [
          ...previousIngredients,
          {
            amount,
            name,
            unit: unit.unit,
          },
        ];
      });
      setAmount(undefined);
      setName(undefined);
      setUnit(undefined);
      if (inputRefUnit.current) {
        inputRefUnit.current.value = '';
      }

      if (inputRefAmount.current) {
        inputRefAmount.current.value = '';
      }

      if (inputRefName.current) {
        inputRefName.current.value = '';
      }

      if (!leaveOpen) {
        close();
      }
    } else {
      enqueueSnackbar(t('create:snackbar.errorFields'), {
        variant: 'warning',
      });
    }
  };

  return (
    <Dialog onClose={close} open={open}>
      <DialogTitle>{t('create:addDialog.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('create:addDialog.text')}</DialogContentText>
        <TextField
          fullWidth
          inputRef={inputRefName}
          label={t('create:addDialog.formFields.name')}
          onChange={handleNameChange}
          required
          sx={{
            mt: 1,
          }}
          value={name}
          variant='outlined'
        />
        <TextField
          fullWidth
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*',
          }}
          inputRef={inputRefAmount}
          label={t('create:addDialog.formFields.amount')}
          onChange={handleAmountChange}
          required
          sx={{
            mt: 1,
          }}
          type='number'
          value={amount}
          variant='outlined'
        />
        <Autocomplete
          getOptionLabel={(option) => {
            return option.unit;
          }}
          groupBy={(option) => {
            return option.category;
          }}
          id='unit'
          onChange={handleUnitChange}
          openOnFocus
          options={options.sort((a, b) => {
            return -b.category.localeCompare(a.category);
          })}
          ref={inputRefUnit}
          renderInput={(parameters) => {
            return <TextField label='Unit' {...parameters} variant='outlined' />;
          }}
          sx={{
            mt: 1,
          }}
          value={unit}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={leaveOpen}
              onChange={() => {
                setLeaveOpen(!leaveOpen);
              }}
            />
          }
          label={t('create:addDialog.formFields.addAnother')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>{t('common:buttons.cancel')}</Button>
        <Button onClick={onSubmit} variant='contained'>
          {t('create:addDialog.formFields.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddIngredient;
