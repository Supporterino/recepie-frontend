/* eslint-disable object-curly-newline */
/* eslint-disable object-property-newline */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-extra-parens */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  getRating,
} from '../../services/requests';
import sendRequest, {
  addRatingUrl,
  updateRatingUrl,
} from '../../services/sendRequest';
import Flex from '../layout/Flex';
import ErrorDisplay from '../queryUtils/ErrorDisplay';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  Typography,
} from '@mui/material';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  useSnackbar,
} from 'notistack';
import {
  useEffect,
  useState,
} from 'react';
import {
  useTranslation,
} from 'react-i18next';

type ReviewProps = {
  close: () => void,
  open: boolean,
  recipeID: string,
};

const Review: React.FunctionComponent<ReviewProps> = ({
  open,
  close,
  recipeID,
}: ReviewProps) => {
  const queryClient = useQueryClient();
  const {
    enqueueSnackbar,
  } = useSnackbar();
  const [
    rating,
    setRating,
  ] = useState<number>(0);
  const {
    t,
  } = useTranslation([
    'common',
    'recipe',
  ]);
  const {
    isLoading,
    isError,
    error,
    data: rawRating,
  } = useQuery<number>([
    'recipeRating',
    recipeID,
  ], () => {
    return getRating(recipeID!);
  });

  useEffect(() => {
    if (rawRating) {
      setRating(rawRating);
    }
  }, [
    rawRating,
  ]);

  const rateMutation = useMutation(
    () => (rawRating === 0 ? sendRequest(addRatingUrl, 'POST', { rating, recipeID }) : sendRequest(updateRatingUrl, 'POST', { rating, recipeID })),
    {
      onError: () => {
        enqueueSnackbar(t('recipe:ratingDialog.error'), {
          variant: 'warning',
        });
      },
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries([
            'recipes',
          ]),
          queryClient.invalidateQueries([
            'ownFavorites',
          ]),
          queryClient.invalidateQueries([
            'lists',
          ]),
          queryClient.invalidateQueries([
            'recipe',
            recipeID,
          ]),
          queryClient.invalidateQueries([
            'ownRecipes',
          ]),
        ]);
        return close();
      },
    },
  );

  if (isError) {
    return (
      <Dialog onClose={close} open={open}>
        <ErrorDisplay text={`${error}`} />
      </Dialog>
    );
  }

  return (
    <Dialog onClose={close} open={open}>
      <DialogTitle>{t('recipe:ratingDialog.title')}</DialogTitle>
      <DialogContent>
        <Flex>
          <Typography mr={1}>{t('recipe:ratingDialog.rating')}</Typography>
          <Rating
            disabled={isLoading} onChange={(event, value) => {
              return setRating(value!);
            }} value={rating}
          />
        </Flex>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color='secondary' disabled={rateMutation.isLoading} onClick={close} variant='outlined'>
          {t('common:buttons.cancel')}
        </Button>
        <Button
          disabled={rateMutation.isLoading}
          onClick={() => {
            rateMutation.mutate();
          }}
          variant='contained'
        >
          {rateMutation.isLoading ? t('common:buttons.pending') : t('common:buttons.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Review;
