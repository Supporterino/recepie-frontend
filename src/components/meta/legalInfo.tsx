import { Link, Typography } from '@mui/material';
import { alignCenterJustifyCenter } from '../layout/commonSx';
import Flex from '../layout/Flex';

const LegalInfo: React.FunctionComponent = () => {
    const startYear = 2020;
    const currentYear = new Date().getFullYear();
    return (
        <Flex sx={{ mt: 1, ...alignCenterJustifyCenter }}>
            <Typography color={'secondary'} variant="body2">
                {`© ${startYear}-${currentYear} `}
                <Link color="inherit" underline="none" href="https://recepie.supporterino.de/">
                    Recepie Team
                </Link>
            </Typography>
        </Flex>
    );
};

export default LegalInfo;
