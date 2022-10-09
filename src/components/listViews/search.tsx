import {
  Autocomplete,
  Chip,
  createFilterOptions,
  Divider,
  IconButton,
  InputBase,
  Rating,
  TextField,
  Typography
} from '@mui/material';
import Flex from '../layout/Flex';
import FlexCol from '../layout/FlexCol';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { alignCenterJustifyCenter, alignCenterJustifyEvenly } from '../layout/commonSx';
import { Recipe } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { getAllRecipes, getAllTags, getFilteredRecipes } from '../../services/requests';
import { useEffect, useState } from 'react';

type SearchProps = {
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<unknown>;
};

const Search: React.FunctionComponent<SearchProps> = ({
  setRecipes,
  setIsError,
  setIsLoading,
  setError
}: SearchProps) => {
  const {
    isLoading: tagsLoading,
    isError: tagsEroor,
    error: tagsErrorText,
    data
  } = useQuery(['tags'], getAllTags);
  const [name, setName] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);
  const [moreOptions, setMoreOptions] = useState<boolean>(false);

  const deleteTag = (toDelete: string) => {
    setTags(tags.filter((tag) => tag !== toDelete));
  };

  const updateTags = (tags: string[]) => {
    const cleanedTags: string[] = [];
    tags.forEach((tag) => cleanedTags.push(tag.replace('create new tag:', '').trim()));
    setTags(cleanedTags);
  };

  const filter = createFilterOptions<string>();

  const {
    isLoading,
    isError,
    error,
    data: recipes,
    refetch
  } = useQuery<Recipe[]>(
    ['recipes'],
    name !== '' || minRating > 0 || tags.length > 0
      ? () => getFilteredRecipes({ text: name, ratingMin: minRating, tags: tags })
      : getAllRecipes
  );

  useEffect(() => {
    setError(error);
    setIsError(isError);
    setIsLoading(isLoading);
    if (recipes) setRecipes(recipes);
  }, [isLoading, isError, error, recipes, setError, setIsError, setIsLoading, setRecipes]);

  return (
    <FlexCol sx={{ boxShadow: 10 }}>
      <Flex sx={{ p: 1, ...alignCenterJustifyCenter }}>
        <AcUnitIcon />
        <InputBase
          fullWidth
          placeholder="Search for recipe"
          sx={{ ml: 1 }}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <IconButton onClick={() => refetch()} sx={{ mr: 0.5 }}>
          <SearchIcon />
        </IconButton>
        <Divider orientation="vertical" />
        <IconButton onClick={() => setMoreOptions((prev) => !prev)}>
          {!moreOptions && <KeyboardArrowLeftIcon />}
          {moreOptions && <KeyboardArrowDownIcon />}
        </IconButton>
      </Flex>
      {moreOptions && (
        <>
          <Divider />
          <Flex sx={{ p: 1, ...alignCenterJustifyEvenly }}>
            <Typography variant="body2">Minimum rating</Typography>
            <Rating
              disabled={isLoading}
              value={minRating}
              onChange={(event, value) => setMinRating(value!)}
            />
          </Flex>
          <Flex sx={{ p: 1 }}>
            {' '}
            <Autocomplete
              multiple
              fullWidth
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
          </Flex>
        </>
      )}
    </FlexCol>
  );
};

export default Search;
