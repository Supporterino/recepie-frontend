import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Rating, Typography } from '@mui/material';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getRating } from '../../services/requests';
import sendRequest, { addRatingUrl, updateRatingUrl } from '../../services/requestService';
import Flex from '../layout/Flex';
import ErrorDisplay from '../queryUtils/ErrorText';

type ReviewProps = {
    open: boolean;
    close: () => void;
    recipeID: string;
};

const Review: React.FunctionComponent<ReviewProps> = ({ open, close, recipeID }: ReviewProps) => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const [rating, setRating] = useState<number>(0);
    const { t } = useTranslation(['common', 'recipe']);
    const { isLoading, isError, error, data: rawRating } = useQuery<number>(['recipeRating', recipeID], () => getRating(recipeID!));

    useEffect(() => {
        if (rawRating) setRating(rawRating);
    }, [rawRating]);

    const rateMutation = useMutation(
        () =>
            rawRating === 0
                ? sendRequest(addRatingUrl, 'POST', { recipeID, rating })
                : sendRequest(updateRatingUrl, 'POST', { recipeID, rating }),
        {
            onSuccess: async () => {
                await Promise.all([
                    queryClient.invalidateQueries(['recipes']),
                    queryClient.invalidateQueries(['ownFavorites']),
                    queryClient.invalidateQueries(['lists']),
                    queryClient.invalidateQueries(['recipe', recipeID]),
                    queryClient.invalidateQueries(['ownRecipes']),
                ]);
                return close();
            },
            onError: (error, variables, context) => {
                enqueueSnackbar(t('recipe:ratingDialog.error'), { variant: 'warning' });
            },
        },
    );

    if (isError)
        return (
            <Dialog open={open} onClose={close}>
                <ErrorDisplay text={`${error}`} />
            </Dialog>
        );

    return (
        <Dialog open={open} onClose={close}>
            <DialogTitle>{t('recipe:ratingDialog.title')}</DialogTitle>
            <DialogContent>
                <Flex>
                    <Typography mr={1}>{t('recipe:ratingDialog.rating')}</Typography>
                    <Rating disabled={isLoading} value={rating} onChange={(event, value) => setRating(value!)} />
                </Flex>
            </DialogContent>
            <DialogActions>
                <Button disabled={rateMutation.isLoading} onClick={close} autoFocus variant="outlined" color="secondary">
                    {t('common:buttons.cancel')}
                </Button>
                <Button
                    disabled={rateMutation.isLoading}
                    onClick={() => {
                        rateMutation.mutate();
                    }}
                    variant="contained"
                >
                    {rateMutation.isLoading ? t('common:buttons.pending') : t('common:buttons.submit')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Review;
