import ImageIcon from '@mui/icons-material/Image';
import {
  Box,
  Skeleton,
} from '@mui/material';
import {
  Image,
} from 'mui-image';

type RecipeImageProps = {
  additionalPictures?: boolean,
  height: string,
  onClick?: () => void,
  rounded?: boolean,
  sx?: {},
  url: string,
  width: string,
};

const RecipeImage: React.FunctionComponent<RecipeImageProps> = ({
  onClick,
  url,
  height,
  width,
  sx,
  rounded,
  additionalPictures,
}: RecipeImageProps) => {
  return (
    <Box
      onClick={onClick} sx={{
        height,
        position: 'relative',
        ...sx,
      }}
    >
      <Image
        duration={100}
        fit='cover'
        height='100%'
        showLoading={<Skeleton animation='wave' height={height} variant='rounded' width={width} />}
        src={url}
        // eslint-disable-next-line react/forbid-component-props
        style={rounded ? {
          border: 0,
          borderRadius: 4,
        } : {}}
        width={width}
      />
      {additionalPictures &&
      <Box sx={{
        bottom: '-5px',
        position: 'absolute',
        right: '2px',
      }}
      >
        <ImageIcon />
      </Box>}
    </Box>
  );
};

export default RecipeImage;
