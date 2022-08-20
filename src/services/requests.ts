import sendRequest, { receipesURL } from './requestService';

export const getAllReceipes = () => {
  return sendRequest(receipesURL(), 'GET').then((res) => res?.json());
};
