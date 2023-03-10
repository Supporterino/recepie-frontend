import sendRequest, {
  deleteRecipeUrl,
} from '../../services/sendRequest';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  useSnackbar,
} from 'notistack';
import {
  useTranslation,
} from 'react-i18next';
import {
  useNavigate,
} from 'react-router-dom';

type DeleteRecipeProps = {
  close: () => void,
  open: boolean,
  recipeID: string,
};

const DeleteRecipe: React.FunctionComponent<DeleteRecipeProps> = ({
  open,
  close,
  recipeID,
}: DeleteRecipeProps) => {
  const queryClient = useQueryClient();
  const {
    enqueueSnackbar,
  } = useSnackbar();
  const navigate = useNavigate();
  const {
    t,
  } = useTranslation([
    'common',
    'recipe',
  ]);
  const deleteMutation = useMutation(() => {
    return sendRequest(deleteRecipeUrl, 'DELETE', {
      recipeID,
    });
  }, {
    onError: () => {
      enqueueSnackbar(t('recipe:deleteDialog.error'), {
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
      return navigate(-1);
    },
  });

  return (
    <Dialog onClose={close} open={open}>
      <DialogTitle color='error'> {t('recipe:deleteDialog.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('recipe:deleteDialog.text')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color='secondary' disabled={deleteMutation.isLoading} onClick={close} variant='outlined'>
          {t('common:buttons.cancel')}
        </Button>
        <Button
          color='error'
          disabled={deleteMutation.isLoading}
          onClick={() => {
            deleteMutation.mutate();
          }}
          startIcon={<DeleteIcon />}
          variant='contained'
        >
          {deleteMutation.isLoading ? t('common:buttons.pending') : t('recipe:deleteDialog.submitButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRecipe;
