/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  getAllRecipes,
  getAllTags,
  getFilteredRecipes,
} from '../../services/requests';
import {
  type Recipe,
} from '../../types';
import {
  alignCenterJustifyCenter,
  alignCenterJustifyEvenly,
} from '../layout/commonSx';
import Flex from '../layout/Flex';
import FlexCol from '../layout/FlexCol';
import {
  Coronavirus,
} from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Chip,
  createFilterOptions,
  Divider,
  IconButton,
  InputBase,
  Rating,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  useQuery,
} from '@tanstack/react-query';
import {
  useEffect,
  useState,
} from 'react';
import {
  useTranslation,
} from 'react-i18next';

type SearchProps = {
  setError: React.Dispatch<unknown>,
  setIsError: React.Dispatch<React.SetStateAction<boolean>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>,
};

const Search: React.FunctionComponent<SearchProps> = ({
  setRecipes,
  setIsError,
  setIsLoading,
  setError,
}: SearchProps) => {
  const {
    data,
  } = useQuery([
    'tags',
  ], getAllTags);
  const [
    name,
    setName,
  ] = useState<string>('');
  const [
    minRating,
    setMinRating,
  ] = useState<number>(0);
  const [
    tags,
    setTags,
  ] = useState<string[]>([]);
  const [
    moreOptions,
    setMoreOptions,
  ] = useState<boolean>(false);
  const [
    rerender,
    setRerender,
  ] = useState<boolean>(false);
  const theme = useTheme();
  const {
    t,
  } = useTranslation('search');

  const deleteTag = (toDelete: string) => {
    setTags(tags.filter((tag) => {
      return tag !== toDelete;
    }));
  };

  const updateTags = (newTags: string[]) => {
    const cleanedTags: string[] = [];
    for (const tag of newTags) {
      cleanedTags.push(tag.trim());
      continue;
    }

    setTags(cleanedTags);
  };

  const filter = createFilterOptions<string>();

  const {
    isLoading,
    isError,
    error,
    data: recipes,
    refetch,
  } = useQuery<Recipe[]>(
    [
      'recipes',
    ],
    name !== '' || minRating > 0 || tags.length > 0 ?
      () => {
        return getFilteredRecipes({
          ratingMin: minRating,
          tags,
          text: name,
        });
      } :
      getAllRecipes,
  );

  useEffect(() => {
    setError(error);
    setIsError(isError);
    setIsLoading(isLoading);
    if (recipes) {
      setRecipes(recipes);
    }
  }, [
    isLoading,
    isError,
    error,
    recipes,
    setError,
    setIsError,
    setIsLoading,
    setRecipes,
  ]);

  useEffect(() => {
    refetch();
    setRerender(false);
  }, [
    refetch,
    rerender,
  ]);

  const reset = () => {
    setName('');
    setMinRating(0);
    setTags([]);
    setRerender(true);
  };

  return (
    <FlexCol
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f9f9f9',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        boxShadow: 10,
        maxWidth: theme.breakpoints.values.lg,
        width: '100%',
      }}
    >
      <Flex sx={{
        p: 1,
        ...alignCenterJustifyCenter,
      }}
      >
        <IconButton onClick={() => {
          return setMoreOptions((previous) => {
            return !previous;
          });
        }}
        >
          {!moreOptions && <Coronavirus />}
          {moreOptions && <KeyboardArrowDownIcon />}
        </IconButton>
        <InputBase
          fullWidth
          onChange={(event) => {
            return setName(event.target.value);
          }}
          placeholder={t('placeholder').toString()}
          sx={{
            ml: 1,
          }}
          value={name}
        />
        <IconButton
          onClick={() => {
            return refetch();
          }} sx={{
            mr: 0.5,
          }}
        >
          <SearchIcon />
        </IconButton>
        <Divider orientation='vertical' />
        <IconButton
          disabled={!(name !== '' || minRating > 0 || tags.length > 0)} onClick={reset} sx={{
            ml: 0.25,
            mr: -0.25,
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Flex>
      {moreOptions &&
      <>
        <Divider />
        <Flex sx={{
          mt: 0.5,
          p: 1,
          ...alignCenterJustifyEvenly,
        }}
        >
          <Typography variant='body2'>{t('minRating')}</Typography>
          <Rating
            disabled={isLoading} onChange={(event, value) => {
              return setMinRating(value!);
            }} value={minRating}
          />
        </Flex>
        <Flex sx={{
          p: 1,
        }}
        >
          <Autocomplete
            filterOptions={(options, parameters) => {
              const filtered = filter(options, parameters);
              return filtered;
            }}
            freeSolo
            fullWidth
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
              return <TextField label={t('tags')} {...parameters} variant='outlined' />;
            }}
            renderTags={(value: readonly string[]) => {
              return value.map((tag: string) => {
                return <Chip
                  color='secondary'
                  id={tag}
                  key={tag}
                  label={tag}
                  onDelete={() => {
                    return deleteTag(tag);
                  }}
                  sx={{
                    mx: 0.2,
                  }}
                />;
              });
            }}
            size='small'
            value={tags}
          />
        </Flex>
      </>}
    </FlexCol>
  );
};

export default Search;
