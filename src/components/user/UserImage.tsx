import { Box, Skeleton } from '@mui/material';
import { Image } from 'mui-image';

type UserImageProps = {
  onClick?: () => void;
  url: string;
  height: string;
  width: string;
  sx?: {};
  rounded?: boolean;
  round?: boolean;
};

const UserImage: React.FunctionComponent<UserImageProps> = ({
  onClick,
  url,
  height,
  width,
  sx,
  rounded,
  round
}: UserImageProps) => {
  return (
    <Box onClick={onClick} sx={{ height: height, m: 1, ...sx }}>
      <Image
        style={rounded ? { borderRadius: 4, border: 0 } : round ? { borderRadius: '50%' } : {}}
        src={url}
        width={width}
        height={'100%'}
        fit={'cover'}
        showLoading={<Skeleton height={height} width={width} variant="circular" animation="wave" />}
      />
    </Box>
  );
};

export default UserImage;
