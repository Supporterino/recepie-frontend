import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import FlexColContainer from '../components/layout/FlexColContainer';
import ErrorDisplay from '../components/queryUtils/ErrorText';
import Loader from '../components/queryUtils/Loader';
import { authenticationManager } from '../services/AuthenticationManager';
import { getOwnRecipes, getUser } from '../services/requests';
import FlexCol from '../components/layout/FlexCol';
import { alignCenterJustifyCenter, alignStartJustifyCenter } from '../components/layout/commonSx';
import { getRoleKeyName, PhotoTypes, Recipe, Role, RoleType, User } from '../types';
import ListOverview from '../components/listViews/ListOverview';
import UserImage from '../components/user/UserImage';
import Flex from '../components/layout/Flex';
import { ReactNode, useState } from 'react';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GppBadIcon from '@mui/icons-material/GppBad';
import ImageUpload from '../components/createSteps/imageUpload';
import { useTranslation } from 'react-i18next';

const UserSite: React.FunctionComponent = () => {
    const userID = authenticationManager.getUserID();
    const { t } = useTranslation(['user', 'lists']);
    const { isLoading, isError, error, data: user } = useQuery<User>(['users', userID], () => getUser(userID));

    const ownRecipesQuery = useQuery<Recipe[]>(['ownRecipes'], getOwnRecipes);
    const [uploadOpen, setUploadOpen] = useState<boolean>(false);

    const getRoleNode = (role: Role): ReactNode => {
        const roleString = getRoleKeyName(role);

        return (
            <Flex sx={{ mb: 0.25, ...alignCenterJustifyCenter }}>
                <AdminPanelSettingsIcon fontSize="small" color={role > 1 ? 'error' : 'secondary'} />
                <Typography color={role > 1 ? 'error' : 'secondary'} sx={{ ml: 0.5 }}>
                    {t(`user:roles.${roleString as RoleType}` as const)}
                </Typography>
            </Flex>
        );
    };

    const getVerifyNode = (verified: boolean): ReactNode => {
        return (
            <Flex sx={alignCenterJustifyCenter}>
                {verified ? <VerifiedUserIcon fontSize="small" /> : <GppBadIcon fontSize="small" />}
                {verified ? (
                    <Typography sx={{ ml: 0.5 }}>{t('user:verified')}</Typography>
                ) : (
                    <Typography sx={{ ml: 0.5 }}>{t('user:unverified')}</Typography>
                )}
            </Flex>
        );
    };

    if (isLoading)
        return (
            <FlexColContainer>
                <Loader />
            </FlexColContainer>
        );

    if (isError)
        return (
            <FlexColContainer>
                <ErrorDisplay text={`${error}`} />
            </FlexColContainer>
        );

    return (
        // TODO: Build site
        <FlexColContainer>
            <Flex sx={alignCenterJustifyCenter}>
                <UserImage
                    sx={{ mr: 5 }}
                    width="150px"
                    height="150px"
                    url={`${user.avatar !== '' ? user.avatar : 'images/no-pictures.png'}`}
                    round
                    onClick={() => setUploadOpen(true)}
                />
                <FlexCol sx={alignStartJustifyCenter}>
                    <Typography sx={{ mb: 0.5 }} variant="h5">
                        {user.username}
                    </Typography>
                    <Flex sx={{ mb: 0.25, ...alignCenterJustifyCenter }}>
                        <CalendarMonthIcon fontSize="small" />
                        <Typography sx={{ ml: 0.5 }}>{new Date(user.joinedAt).toLocaleDateString()}</Typography>
                    </Flex>
                    {getRoleNode(user.role)}
                    {getVerifyNode(user.verified)}
                </FlexCol>
            </Flex>
            <ImageUpload
                open={uploadOpen}
                close={() => {
                    setUploadOpen(false);
                }}
                target={PhotoTypes.AVATAR}
            />
            <ListOverview name={t('lists:ownRecipes')} queryObject={ownRecipesQuery} />
        </FlexColContainer>
    );
};

export default UserSite;
