import { Autocomplete, Chip, createFilterOptions, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getAllTags } from '../../services/requests';
import Flex from '../layout/Flex';

type TagListProps = {
    initialTags: string[];
    editable?: boolean;
    updateHook?: Dispatch<SetStateAction<string[]>>;
};

const TagList: React.FunctionComponent<TagListProps> = ({ initialTags, editable, updateHook }: TagListProps) => {
    const { data } = useQuery(['tags'], getAllTags);
    const [tags, setTags] = useState<string[]>(initialTags);

    useEffect(() => {
        if (updateHook) updateHook(tags);
    }, [tags, updateHook]);

    const deleteTag = (toDelete: string) => {
        setTags(tags.filter(tag => tag !== toDelete));
    };

    const updateTags = (tags: string[]) => {
        const cleanedTags: string[] = [];
        tags.forEach(tag => cleanedTags.push(tag.replace('create new tag:', '').trim()));
        setTags(cleanedTags);
    };

    const filter = createFilterOptions<string>();

    return (
        <Flex sx={{ flexWrap: 'wrap', mt: 1, mb: 1, width: '100%' }}>
            {!editable ? (
                tags.map((tag: string) => <Chip label={tag} sx={{ mx: 0.2 }} />)
            ) : (
                <Autocomplete
                    multiple
                    fullWidth
                    id="tags-filled"
                    options={data.sort().map((option: string) => option)}
                    renderTags={(value: readonly string[]) =>
                        value.map((tag: string) => (
                            <Chip label={tag} key={tag} id={tag} sx={{ mx: 0.2 }} color="secondary" onDelete={() => deleteTag(tag)} />
                        ))
                    }
                    value={tags}
                    onChange={(event, value) => updateTags(value)}
                    freeSolo
                    getOptionDisabled={option => option.includes('invalid input')}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const inputValue = params.inputValue.trim();
                        // Suggest the creation of a new value
                        const isExisting = options.some(option => inputValue === option);

                        if (inputValue.includes(' ')) {
                            filtered.push(`invalid input: ${inputValue}`);
                        } else if (inputValue !== '' && !isExisting) {
                            filtered.push(`create new tag: ${inputValue}`);
                        }

                        return filtered;
                    }}
                    renderInput={params => (
                        <TextField label={t('create:basic.formFields.tags')} margin="normal" required {...params} variant="outlined" />
                    )}
                />
            )}
        </Flex>
    );
};

export default TagList;
