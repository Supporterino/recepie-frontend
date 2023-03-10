import {
  alignCenterJustifyCenter,
} from '../layout/commonSx';
import Flex from '../layout/Flex';
import {
  Link,
  Typography,
} from '@mui/material';

const LegalInfo: React.FunctionComponent = () => {
  const startYear = 2_020;
  const currentYear = new Date().getFullYear();
  return (
    <Flex sx={{
      mt: 1,
      ...alignCenterJustifyCenter,
    }}
    >
      <Typography color='secondary' variant='body2'>
        {`© ${startYear}-${currentYear} `}
        <Link color='inherit' href='https://recepie.supporterino.de/' underline='none'>
          Recepie Team
        </Link>
      </Typography>
    </Flex>
  );
};

export default LegalInfo;
