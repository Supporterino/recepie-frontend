import { useRef, useState } from 'react';
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  Stack,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { authenticationManager } from '../../services/AuthenticationManager';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import sendRequest, { imageUploadUrl } from '../../services/requestService';
import { useSnackbar } from 'notistack';

export enum Target {
  USER = 'user',
  RECIPE = 'recipe'
}

type ImageUploadProps = {
  open: boolean;
  close: Function;
  target: Target;
  recipeID: string;
};

const ImageUpload: React.FunctionComponent<ImageUploadProps> = ({
  open,
  close,
  target,
  recipeID
}: ImageUploadProps) => {
  const inputFile = useRef<HTMLInputElement>(null);
  const [waiting, setWaiting] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const uploadMutation = useMutation(
    (data: FormData) => sendRequest(imageUploadUrl, 'POST', data, false),
    {
      onSuccess: () => {
        return Promise.all([
          queryClient.invalidateQueries(['recipes']),
          queryClient.invalidateQueries(['ownFavorites']),
          queryClient.invalidateQueries(['lists']),
          queryClient.invalidateQueries(['recipe', recipeID]),
          setWaiting(false),
          close()
        ]);
      },
      onError: (error, variables, context) => {
        enqueueSnackbar('Failed to upload image', { variant: 'warning' });
        close();
      }
    }
  );

  const upload = () => {
    if (hasFile()) {
      const data: FormData = new FormData();
      data.append('target', target);
      if (target === Target.USER) data.append('userID', authenticationManager.getUserID());
      if (target === Target.RECIPE) data.append('recipeID', recipeID);
      // adding the file has to be last
      data.append('myfile', (inputFile.current!.children[0]! as HTMLInputElement).files![0]);

      // TODO: Upload image
      uploadMutation.mutate(data);
    }
  };

  const hasFile = () => {
    if (inputFile.current && inputFile.current.children[0]) {
      const input = inputFile.current.children[0] as HTMLInputElement;
      return input.files && input.files.length === 1;
    }
    return false;
  };

  return (
    <Dialog open={open} onClose={() => close()}>
      <DialogTitle color="text.primary">
        Image Upload
        <IconButton
          onClick={() => close()}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1} alignItems="flex-end">
          <Typography color="text.secondary" alignSelf="flex-start">
            Please upload an image file below.
          </Typography>

          <Input
            type="file"
            id="file"
            ref={inputFile}
            color="secondary"
            onChange={() => {
              setDisabled(!hasFile());
            }}
          />

          <Button
            disabled={disabled}
            variant="contained"
            sx={{ width: '50%', right: 0 }}
            onClick={(event) => {
              setWaiting(true);
              setDisabled(true);
              upload();
            }}
          >
            Upload
          </Button>
        </Stack>
      </DialogContent>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={waiting}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default ImageUpload;
