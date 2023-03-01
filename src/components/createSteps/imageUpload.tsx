import { useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { authenticationManager } from '../../services/AuthenticationManager';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import sendRequest, { imageUploadUrl } from '../../services/requestService';
import { useSnackbar } from 'notistack';
import FlexCol from '../layout/FlexCol';
import { useTranslation } from 'react-i18next';
import { PhotoTypes } from '../../types';

type ImageUploadProps = {
  open: boolean;
  close: Function;
  target: PhotoTypes;
  recipeID?: string;
};

const ImageUpload: React.FunctionComponent<ImageUploadProps> = ({
  open,
  close,
  target,
  recipeID
}: ImageUploadProps) => {
  const inputFile = useRef<HTMLInputElement>(null);
  const [disabled, setDisabled] = useState<boolean>(true);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation(['common', 'create']);

  const uploadMutation = useMutation(
    (data: FormData) => sendRequest(imageUploadUrl, 'POST', data, false),
    {
      onSuccess: () => {
        return Promise.all([
          queryClient.invalidateQueries(['recipes']),
          queryClient.invalidateQueries(['ownFavorites']),
          queryClient.invalidateQueries(['lists']),
          queryClient.invalidateQueries(['recipe', recipeID]),
          queryClient.invalidateQueries(['users']),
          close()
        ]);
      },
      onError: (error, variables, context) => {
        enqueueSnackbar(t('create:imageUpload.error'), { variant: 'warning' });
        close();
      }
    }
  );

  const upload = () => {
    if (hasFile()) {
      const data: FormData = new FormData();
      data.append('target', target);
      if (target === PhotoTypes.AVATAR) data.append('userID', authenticationManager.getUserID());
      if (target === PhotoTypes.RECIPE) data.append('recipeID', recipeID!);
      data.append('myfile', (inputFile.current!.children[0]! as HTMLInputElement).files![0]);

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
        {t('create:imageUpload.title')}
        <IconButton
          disabled={uploadMutation.isLoading}
          onClick={() => close()}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FlexCol>
          <Typography color="text.secondary" alignSelf="flex-start">
            {t('create:imageUpload.text')}
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
        </FlexCol>
      </DialogContent>
      <DialogActions>
        <Button disabled={uploadMutation.isLoading} onClick={() => close()}>
          {t('common:buttons.cancel')}
        </Button>
        <Button
          disabled={disabled}
          variant="contained"
          onClick={(event) => {
            setDisabled(true);
            upload();
          }}
        >
          {uploadMutation.isLoading ? t('common:buttons.pending') : t('common:buttons.upload')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageUpload;
