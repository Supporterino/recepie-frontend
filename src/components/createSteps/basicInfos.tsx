import {
  getAllTags,
} from '../../services/requests';
import FlexColContainer from '../layout/FlexColContainer';
import ErrorDisplay from '../queryUtils/ErrorDisplay';
import Loader from '../queryUtils/Loader';
import {
  Autocomplete,
  Chip,
  createFilterOptions,
  TextField,
} from '@mui/material';
import {
  useQuery,
} from '@tanstack/react-query';
import {
  useEffect,
  useState,
} from 'react';
import {
  useFormContext,
} from 'react-hook-form';
import {
  useTranslation,
} from 'react-i18next';

const BasicInfos: React.FunctionComponent = () => {
  const {
    isLoading,
    isError,
    error,
    data,
  } = useQuery([
    'tags',
  ], getAllTags);
  const {
    register,
    setValue,
    getValues,
  } = useFormContext();
  const [
    tags,
    setTags,
  ] = useState<string[]>(getValues('tags') || []);
  const [
    servings,
    setServings,
  ] = useState<number>(getValues('numberOfServings' || 1));
  const {
    t,
  } = useTranslation([
    'common',
    'create',
  ]);

  useEffect(() => {
    setValue('tags', tags);
  }, [
    tags,
    setValue,
  ]);

  useEffect(() => {
    setValue('numberOfServings', servings);
  }, [
    servings,
    setValue,
  ]);

  const deleteTag = (toDelete: string) => {
    setTags(tags.filter((tag) => {
      return tag !== toDelete;
    }));
  };

  const updateTags = (newTags: string[]) => {
    const cleanedTags: string[] = [];
    for (const tag of newTags) {
      cleanedTags.push(tag.replace('create new tag:', '').trim());
      continue;
    }

    setTags(cleanedTags);
  };

  const filter = createFilterOptions<string>();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorDisplay text={`${error}`} />;
  }

  return (
    <FlexColContainer>
      <TextField
        {...register('name')}
        autoComplete='name'
        autoFocus
        fullWidth
        id='name'
        label={t('create:basic.formFields.name')}
        margin='normal'
        name='name'
        required
      />
      <TextField
        fullWidth
        inputProps={{
          inputMode: 'numeric',
          pattern: '[0-9]*',
        }}
        label={t('create:basic.formFields.servings')}
        margin='normal'
        onChange={(event) => {
          return setServings(Number(event.target.value));
        }}
        required
        type='number'
        value={servings}
      />
      <TextField
        {...register('description')}
        autoComplete='description'
        fullWidth
        id='description'
        label={t('create:basic.formFields.description')}
        margin='normal'
        multiline
        name='description'
        required
      />
      <Autocomplete
        filterOptions={(options, parameters) => {
          const filtered = filter(options, parameters);

          const inputValue = parameters.inputValue.trim();
          // Suggest the creation of a new value
          const isExisting = options.includes(inputValue);

          if (inputValue.includes(' ')) {
            filtered.push(`invalid input: ${inputValue}`);
          } else if (inputValue !== '' && !isExisting) {
            filtered.push(`create new tag: ${inputValue}`);
          }

          return filtered;
        }}
        freeSolo
        getOptionDisabled={(option) => {
          return option.includes('invalid input');
        }}
        id='tags-filled'
        multiple
        onChange={(event, value) => {
          return updateTags(value);
        }}
        options={data.sort().map((option: string) => {
          return option;
        })}
        renderInput={(parameters) => {
          return <TextField label={t('create:basic.formFields.tags')} margin='normal' required {...parameters} variant='outlined' />;
        }}
        renderTags={(value: readonly string[]) => {
          return value.map((tag: string) => {
            return <Chip
              color='secondary' id={tag} key={tag}
              label={tag} onDelete={() => {
                return deleteTag(tag);
              }} sx={{
                mx: 0.2,
              }}
            />;
          });
        }}
        value={tags}
      />
    </FlexColContainer>
  );
};

export default BasicInfos;
