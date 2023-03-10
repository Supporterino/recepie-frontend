/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  authenticationManager,
} from '../../services/AuthenticationManager';
import sendRequest, {
  imageUploadUrl,
} from '../../services/sendRequest';
import {
  PhotoTypes,
} from '../../types';
import FlexCol from '../layout/FlexCol';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  Typography,
} from '@mui/material';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  useSnackbar,
} from 'notistack';
import {
  useRef,
  useState,
} from 'react';
import {
  useTranslation,
} from 'react-i18next';

type ImageUploadProps = {
  close: Function,
  open: boolean,
  recipeID?: string,
  target: PhotoTypes,
};

const ImageUpload: React.FunctionComponent<ImageUploadProps> = ({
  open,
  close,
  target,
  recipeID,
}: ImageUploadProps) => {
  const inputFile = useRef<HTMLInputElement>(null);
  const [
    disabled,
    setDisabled,
  ] = useState<boolean>(true);
  const queryClient = useQueryClient();
  const {
    enqueueSnackbar,
  } = useSnackbar();
  const {
    t,
  } = useTranslation([
    'common',
    'create',
  ]);

  const uploadMutation = useMutation((data: FormData) => {
    return sendRequest(imageUploadUrl, 'POST', data, false);
  }, {
    onError: () => {
      enqueueSnackbar(t('create:imageUpload.error'), {
        variant: 'warning',
      });
      close();
    },
    onSuccess: () => {
      return Promise.all([
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
          'users',
        ]),
        close(),
      ]);
    },
  });

  const hasFile = () => {
    if (inputFile.current?.children[0]) {
      const input = inputFile.current.children[0] as HTMLInputElement;
      return input.files && input.files.length === 1;
    }

    return false;
  };

  const upload = () => {
    if (hasFile()) {
      const data: FormData = new FormData();
      data.append('target', target);
      if (target === PhotoTypes.AVATAR) {
        data.append('userID', authenticationManager.getUserID());
      }

      if (target === PhotoTypes.RECIPE || target === PhotoTypes.ADDITION_RECIPE) {
        data.append('recipeID', recipeID!);
      }

      data.append('myfile', (inputFile.current!.children[0]! as HTMLInputElement).files![0]);

      uploadMutation.mutate(data);
    }
  };

  return (
    <Dialog
      onClose={() => {
        return close();
      }} open={open}
    >
      <DialogTitle color='text.primary'>
        {t('create:imageUpload.title')}
        <IconButton
          disabled={uploadMutation.isLoading}
          onClick={() => {
            return close();
          }}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FlexCol>
          <Typography alignSelf='flex-start' color='text.secondary'>
            {t('create:imageUpload.text')}
          </Typography>
          <Input
            color='secondary'
            id='file'
            onChange={() => {
              setDisabled(!hasFile());
            }}
            ref={inputFile}
            type='file'
          />
        </FlexCol>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={uploadMutation.isLoading} onClick={() => {
            return close();
          }}
        >
          {t('common:buttons.cancel')}
        </Button>
        <Button
          disabled={disabled}
          onClick={() => {
            setDisabled(true);
            upload();
          }}
          variant='contained'
        >
          {uploadMutation.isLoading ? t('common:buttons.pending') : t('common:buttons.upload')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageUpload;
