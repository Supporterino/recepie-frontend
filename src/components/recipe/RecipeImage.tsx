import { Box, Skeleton } from '@mui/material';
import { Image } from 'mui-image';
import ImageIcon from '@mui/icons-material/Image';

type RecipeImageProps = {
    onClick?: () => void;
    url: string;
    height: string;
    width: string;
    sx?: {};
    rounded?: boolean;
    additionalPictures?: boolean;
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
        <Box onClick={onClick} sx={{ height: height, position: 'relative', ...sx }}>
            <Image
                style={rounded ? { borderRadius: 4, border: 0 } : {}}
                src={url}
                width={width}
                height={'100%'}
                fit={'cover'}
                duration={100}
                showLoading={<Skeleton height={height} width={width} variant="rounded" animation="wave" />}
            />
            {additionalPictures && (
                <Box sx={{ position: 'absolute', bottom: '-5px', right: '2px' }}>
                    <ImageIcon />
                </Box>
            )}
        </Box>
    );
};

export default RecipeImage;
