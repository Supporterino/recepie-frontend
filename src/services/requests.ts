import sendRequest, {
  backendVersionUrl,
  checkOwnerUrl,
  getByIDUrl,
  getCookListUrl,
  getOwnFavoritesUrl,
  getUserUrl,
  ownRatingUrl,
  receipesURL,
  tagsURL
} from './requestService';

export const getAllReceipes = () => {
  return sendRequest(receipesURL(), 'GET').then((res) => {
    if (!res) throw new Error('No Response');
    if (res.status !== 200) throw new Error('Non OK response');
    return res.json();
  });
};

export const getRecipe = (id: string) => {
  return sendRequest(getByIDUrl(), 'POST', { recipeID: id }).then((res) => {
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

export const getCookList = () => {
  return sendRequest(getCookListUrl, 'GET').then((res) => {
    if (!res) throw new Error('No Response');
    if (res.status !== 200) throw new Error('Non OK response');
    return res.json();
  });
};

export const getOwnFavorites = () => {
  return sendRequest(getOwnFavoritesUrl, 'GET').then((res) => {
    if (!res) throw new Error('No Response');
    if (res.status !== 200) throw new Error('Non OK response');
    return res.json();
  });
};

export const checkOwner = (recipeID: string) => {
  return sendRequest(checkOwnerUrl, 'POST', { recipeID }).then((res) => {
    if (!res) throw new Error('No Response');
    if (res.status !== 200) throw new Error('Non OK response');
    return res.json();
  });
};

export const getRating = (recipeID: string) => {
  return sendRequest(ownRatingUrl, 'POST', { recipeID }).then((res) => {
    if (!res) throw new Error('No Response');
    if (res.status !== 200) throw new Error('Non OK response');
    return res.json();
  });
};

export const getBackendVersion = () => {
  return sendRequest(backendVersionUrl(), 'GET').then((res) => {
    if (!res) throw new Error('No Response');
    if (res.status !== 200) throw new Error('Non OK response');
    return res.json();
  });
};
