import {
  centerStyle,
} from '../layout/commonSx';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  IconButton,
  Popover,
  Skeleton,
} from '@mui/material';
import {
  Image,
} from 'mui-image';
import {
  useState,
} from 'react';

type UserImageProps = {
  height: string,
  onClick?: () => void,
  round?: boolean,
  rounded?: boolean,
  sx?: {},
  url: string,
  width: string,
};

const UserImage: React.FunctionComponent<UserImageProps> = ({
  onClick,
  url,
  height,
  width,
  sx,
  rounded,
  round,
}: UserImageProps) => {
  const [
    anchorElement,
    setAnchorElement,
  ] = useState<HTMLElement | null>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorElement(null);
  };

  const open = Boolean(anchorElement);

  const borderStyle = rounded ? {
    border: 0,
    borderRadius: 4,
  // eslint-disable-next-line unicorn/no-nested-ternary, object-curly-newline
  } : round ? { borderRadius: '50%' } : {};
  return (
    <Box
      onClick={onClick} onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}
      sx={{
        height,
        m: 1,
        ...sx,
      }}
    >
      <Popover
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            ...borderStyle,
          },
        }}
        anchorEl={anchorElement}
        disableEnforceFocus
        disableRestoreFocus
        id='mouse-over-popover'
        marginThreshold={0}
        onClose={handlePopoverClose}
        open={open}
        sx={{
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            height,
            m: 0,
            width,
            ...centerStyle,
            backgroundColor: '#00000080',
            ...borderStyle,
          }}
        >
          <IconButton>
            <EditIcon fontSize='large' />
          </IconButton>
        </Box>
      </Popover>
      <Image
        duration={100}
        fit='cover'
        height='100%'
        showLoading={<Skeleton animation='wave' height={height} variant='circular' width={width} />}
        src={url}
        // eslint-disable-next-line react/forbid-component-props
        style={borderStyle}
        width={width}
      />
    </Box>
  );
};

export default UserImage;
