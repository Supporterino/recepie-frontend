import {
  Autocomplete,
  Chip,
  createFilterOptions,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getAllTags } from '../../services/requests';
import FlexColContainer from '../layout/FlexColContainer';
import ErrorDisplay from '../queryUtils/ErrorText';
import Loader from '../queryUtils/Loader';

const BasicInfos: React.FunctionComponent = () => {
  const { isLoading, isError, error, data } = useQuery(['tags'], getAllTags);
  const { register, setValue, getValues } = useFormContext();
  const [tags, setTags] = useState<string[]>(getValues('tags') || []);

  useEffect(() => {
    setValue('tags', tags);
  }, [tags, setValue]);

  const deleteTag = (toDelete: string) => {
    setTags(tags.filter((tag) => tag !== toDelete));
  };

  const updateTags = (tags: string[]) => {
    const cleanedTags: string[] = [];
    tags.forEach((tag) => cleanedTags.push(tag.replace('create new tag:', '').trim()));
    setTags(cleanedTags);
  };

  const filter = createFilterOptions<string>();

  if (isLoading) return <Loader></Loader>;

  if (isError) return <ErrorDisplay text={`${error}`}></ErrorDisplay>;

  return (
    <FlexColContainer>
      <TextField
        {...register('name')}
        margin="normal"
        required
        fullWidth
        id="name"
        label="Name"
        name="name"
        autoComplete="name"
        autoFocus
      />
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item xs={6}>
          <Typography align="center" margin="normal" variant="body1">
            Number of servings
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            {...register('numberOfServings')}
            margin="normal"
            required
            fullWidth
            id="numOfServings"
            // label="numOfServings"
            name="numOfServings"
            autoComplete="numOfServings"
            type="number"
            autoFocus
          />
        </Grid>
      </Grid>
      <TextField
        {...register('description')}
        margin="normal"
        required
        fullWidth
        id="description"
        label="Description"
        name="description"
        autoComplete="description"
        autoFocus
        multiline
      />
      <Autocomplete
        multiple
        id="tags-filled"
        options={data.sort().map((option: string) => option)}
        renderTags={(value: readonly string[]) =>
          value.map((tag: string) => (
            <Chip
              label={tag}
              key={tag}
              id={tag}
              sx={{ mx: 0.2 }}
              color="secondary"
              onDelete={() => deleteTag(tag)}
            />
          ))
        }
        value={tags}
        onChange={(event, value) => updateTags(value)}
        freeSolo
        getOptionDisabled={(option) => option.includes('invalid input')}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const inputValue = params.inputValue.trim();
          // Suggest the creation of a new value
          const isExisting = options.some((option) => inputValue === option);

          if (inputValue.includes(' ')) {
            filtered.push(`invalid input: ${inputValue}`);
          } else if (inputValue !== '' && !isExisting) {
            filtered.push(`create new tag: ${inputValue}`);
          }

          return filtered;
        }}
        renderInput={(params) => <TextField label="Tags" {...params} variant="outlined" />}
      />
    </FlexColContainer>
  );
};

export default BasicInfos;
