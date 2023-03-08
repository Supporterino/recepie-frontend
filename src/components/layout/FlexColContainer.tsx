import { Box, Container, SxProps, Theme } from '@mui/material';
import { alignCenterJustifyCenter } from './commonSx';

type FlexColContainerProps = {
    header?: React.ReactNode;
    children?: React.ReactNode;
    sx?: SxProps<Theme>;
};

const FlexColContainer: React.FunctionComponent<FlexColContainerProps> = ({ children, sx, header }: FlexColContainerProps) => {
    return (
        <Box
            sx={{
                height: '100%',
                width: '100%',
                overflow: ' hidden',
                display: 'flex',
                flexDirection: 'column',
                ...alignCenterJustifyCenter,
            }}
        >
            {header}
            <Container sx={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', height: '100%', ...sx }}>{children}</Container>
        </Box>
    );
};

export default FlexColContainer;
