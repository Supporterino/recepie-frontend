import { Box } from '@mui/material';

type ListPreviewProps = {
  imgURL: string;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
};

const ListPreview: React.FunctionComponent<ListPreviewProps> = ({
  imgURL,
  onClick
}: ListPreviewProps) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: '100px',
        height: '100px',
        backgroundImage: imgURL,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        m: 1,
        borderRadius: 2,
        border: 0,
        boxShadow: 10
      }}
    />
  );
};

export default ListPreview;
