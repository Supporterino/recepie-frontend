import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import sendRequest, { deleteRecipeUrl } from '../../services/requestService';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type DeleteRecipeProps = {
  open: boolean;
  close: () => void;
  recipeID: string;
};

const DeleteRecipe: React.FunctionComponent<DeleteRecipeProps> = ({
  open,
  close,
  recipeID
}: DeleteRecipeProps) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'recipe']);
  const deleteMutation = useMutation(() => sendRequest(deleteRecipeUrl, 'DELETE', { recipeID }), {
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries(['recipes']),
        queryClient.invalidateQueries(['ownFavorites']),
        queryClient.invalidateQueries(['lists']),
        queryClient.invalidateQueries(['recipe', recipeID]),
        queryClient.invalidateQueries(['ownRecipes'])
      ]);
      return navigate(-1);
    },
    onError: (error, variables, context) => {
      enqueueSnackbar(t('recipe:deleteDialog.error'), { variant: 'warning' });
    }
  });

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle color="error"> {t('recipe:deleteDialog.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('recipe:deleteDialog.text')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={deleteMutation.isLoading}
          onClick={close}
          autoFocus
          variant="outlined"
          color="secondary"
        >
          {t('common:buttons.cancel')}
        </Button>
        <Button
          disabled={deleteMutation.isLoading}
          onClick={() => {
            deleteMutation.mutate();
          }}
          variant="contained"
          startIcon={<DeleteIcon />}
          color="error"
        >
          {deleteMutation.isLoading
            ? t('common:buttons.pending')
            : t('recipe:deleteDialog.submitButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRecipe;
