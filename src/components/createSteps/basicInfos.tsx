import {
  Autocomplete,
  Chip,
  Container,
  createFilterOptions,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { getAllTags } from '../../services/requests';
import ErrorDisplay from '../queryUtils/ErrorText';
import Loader from '../queryUtils/Loader';

type BasicInfosProps = {
  nameRegister: UseFormRegisterReturn;
  descriptionRegister: UseFormRegisterReturn;
  numOfServings: UseFormRegisterReturn;
};

const BasicInfos: React.FunctionComponent<BasicInfosProps> = ({
  nameRegister,
  descriptionRegister,
  numOfServings
}: BasicInfosProps) => {
  const { isLoading, isError, error, data } = useQuery(['receipes'], getAllTags);
  const [tags, setTags] = useState<string[]>([]);

  const deleteTag = (toDelete: string) => {
    setTags(tags.filter((tag) => tag !== toDelete));
  };

  const updateTags = (tags: string[]) => {
    const cleanedTags = tags.filter((tag) => tag.trim());
    setTags(cleanedTags);
  };

  const filter = createFilterOptions<string>();

  if (isLoading) return <Loader></Loader>;

  if (isError) return <ErrorDisplay text={`${error}`}></ErrorDisplay>;

  return (
    <Container sx={{ flexGrow: 1 }}>
      <TextField
        {...nameRegister}
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
          <Typography
            align="center"
            margin="normal"
            sx={{
              fontSize: '1.25rem'
            }}
            variant="body2"
          >
            Number of servings
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            {...numOfServings}
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
        {...descriptionRegister}
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
              color="secondary"
              onDelete={() => deleteTag(tag)}
            />
          ))
        }
        value={tags}
        onChange={(event, value) => updateTags(value)}
        freeSolo
        // getOptionDisabled={(option) => option.includes('invalid input')}
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
    </Container>
  );
};

export default BasicInfos;
