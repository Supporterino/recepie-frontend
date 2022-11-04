import { Box, IconButton, Popover, Skeleton } from '@mui/material';
import { Image } from 'mui-image';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { centerStyle } from '../layout/commonSx';

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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const borderStyle = rounded
    ? { borderRadius: 4, border: 0 }
    : round
    ? { borderRadius: '50%' }
    : {};
  return (
    <Box
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
      onClick={onClick}
      sx={{ height: height, m: 1, ...sx }}
    >
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none'
        }}
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            ...borderStyle
          }
        }}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        marginThreshold={0}
        disableRestoreFocus
        disableEnforceFocus
      >
        <Box
          sx={{
            height: height,
            width: width,
            m: 0,
            ...centerStyle,
            backgroundColor: '#00000080',
            ...borderStyle
          }}
        >
          <IconButton>
            <EditIcon fontSize="large" />
          </IconButton>
        </Box>
      </Popover>
      <Image
        style={borderStyle}
        src={url}
        width={width}
        height={'100%'}
        fit={'cover'}
        duration={100}
        showLoading={<Skeleton height={height} width={width} variant="circular" animation="wave" />}
      />
    </Box>
  );
};

export default UserImage;
