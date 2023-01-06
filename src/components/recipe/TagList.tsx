import { Chip, IconButton } from '@mui/material';
import { useState } from 'react';
import Flex from '../layout/Flex';
import FlexCol from '../layout/FlexCol';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

type TagListProps = {
  tags: string[];
};

const TagList: React.FunctionComponent<TagListProps> = ({ tags }: TagListProps) => {
    const [expand, setExpand] = useState<boolean>(false)
    const shouldSplit = tags.length > 2;
    let toRender: JSX.Element[];

    if (shouldSplit) {
        toRender = tags.slice(0, 2).map((tag: string) => <Chip label={tag} sx={{ mx: 0.2 }} />)
    } else {
        toRender = tags.map((tag: string) => <Chip label={tag} sx={{ mx: 0.2 }} />)
    }

  return (
      <Flex>
        {toRender}
        {shouldSplit && <IconButton onClick={() => setExpand((prev) => !prev)}><ArrowBackIosNewIcon /></IconButton>}
        {expand && tags.map((tag: string) => <Chip label={tag} sx={{ mx: 0.2 }} />)}
      </Flex>
  );
};

export default TagList;
