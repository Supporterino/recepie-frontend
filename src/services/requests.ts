import sendRequest, { getUserUrl, receipesURL, tagsURL } from './requestService';

export const getAllReceipes = () => {
  return sendRequest(receipesURL(), 'GET').then((res) => {
    if (!res) throw new Error('No Response');
    if (res.status !== 200) throw new Error('Non OK response');
    return res.json();
  });
};

export const getAllTags = () => {
  return sendRequest(tagsURL(), 'GET').then((res) => {
    if (!res) throw new Error('No Response');
    if (res.status !== 200) throw new Error('Non OK response');
    return res.json();
  });
};

export const getUser = (userID: string) => {
  return sendRequest(getUserUrl, 'POST', { userID }).then((res) => {
    if (!res) throw new Error('No Response');
    if (res.status !== 200) throw new Error('Non OK response');
    return res.json();
  });
};
