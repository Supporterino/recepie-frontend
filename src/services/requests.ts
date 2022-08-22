import sendRequest, { receipesURL } from './requestService';

export const getAllReceipes = () => {
  return sendRequest(receipesURL(), 'GET').then((res) => {
    if (!res) throw new Error('No Response')
    if (res.status !== 200) throw new Error('Non OK response')
    return res.json()
  });
};
