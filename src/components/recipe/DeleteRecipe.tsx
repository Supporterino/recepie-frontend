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
  const deleteMutation = useMutation(() => sendRequest(deleteRecipeUrl, 'DELETE', { recipeID }), {
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries(['recipes']),
        queryClient.invalidateQueries(['ownFavorites']),
        queryClient.invalidateQueries(['lists']),
        queryClient.invalidateQueries(['recipe', recipeID])
      ]);
      return navigate(-1);
    },
    onError: (error, variables, context) => {
      enqueueSnackbar('Failed to delete recipe', { variant: 'warning' });
    }
  });

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle color="error">{'Delete recipe?'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure that you want to delete this recipe? Deletions cannot be reverted and neither
          you nor any other users can access the recipe.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={deleteMutation.isLoading}
          onClick={close}
          autoFocus
          variant="outlined"
          color="secondary"
        >
          Cancel
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
          {deleteMutation.isLoading ? 'Processing...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRecipe;
