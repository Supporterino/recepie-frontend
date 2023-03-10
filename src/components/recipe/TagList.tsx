import {
  getAllTags,
} from '../../services/requests';
import Flex from '../layout/Flex';
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
  t,
} from 'i18next';
import {
  type Dispatch,
  type SetStateAction,
} from 'react';
import {
  useEffect,
  useState,
} from 'react';

type TagListProps = {
  editable?: boolean,
  initialTags: string[],
  updateHook?: Dispatch<SetStateAction<string[]>>,
};

const TagList: React.FunctionComponent<TagListProps> = ({
  initialTags,
  editable,
  updateHook,
}: TagListProps) => {
  const {
    data,
  } = useQuery([
    'tags',
  ], getAllTags);
  const [
    tags,
    setTags,
  ] = useState<string[]>(initialTags);

  useEffect(() => {
    if (updateHook) {
      updateHook(tags);
    }
  }, [
    tags,
    updateHook,
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

  return (
    <Flex sx={{
      flexWrap: 'wrap',
      mb: 1,
      mt: 1,
      width: '100%',
    }}
    >
      {editable ?
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
        /> : tags.map((tag: string) => {
          return <Chip
            key={tag} label={tag} sx={{
              mx: 0.2,
            }}
          />;
        })}
    </Flex>
  );
};

export default TagList;
