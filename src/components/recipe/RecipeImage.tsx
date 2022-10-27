import { Box, Skeleton } from '@mui/material';
import { Image } from 'mui-image';

type RecipeImageProps = {
  onClick?: () => void;
  url: string;
  height: string;
  width: string;
  sx?: {};
  rounded?: boolean;
};

const RecipeImage: React.FunctionComponent<RecipeImageProps> = ({
  onClick,
  url,
  height,
  width,
  sx,
  rounded
}: RecipeImageProps) => {
  return (
    <Box onClick={onClick} sx={{ height: height, ...sx }}>
      <Image
        style={rounded ? { borderRadius: 4, border: 0 } : {}}
        src={url}
        width={width}
        height={'100%'}
        fit={'cover'}
        showLoading={<Skeleton height={height} width={width} variant="rounded" animation="wave" />}
      />
    </Box>
  );
};

export default RecipeImage;
