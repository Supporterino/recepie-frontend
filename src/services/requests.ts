import sendRequest, {
  backendVersionUrl,
  checkOwnerUrl,
  getByIDUrl,
  getCookListUrl,
  getOwnFavoritesUrl,
  getOwnRecipesUrl,
  getUserUrl,
  ownRatingUrl,
  receipesURL,
  recipesFilteredUrl,
  tagsURL,
} from './sendRequest';

export const getAllRecipes = async () => {
  const response = await sendRequest(receipesURL(), 'GET');

  if (!response) {
    throw new Error('No response received.');
  }

  return response.json();
};

export const getOwnRecipes = async () => {
  const response = await sendRequest(getOwnRecipesUrl, 'GET');

  if (!response) {
    throw new Error('No Response');
  }

  return response.json();
};

export const getRecipe = async (id: string) => {
  const response = await sendRequest(getByIDUrl(), 'POST', {
    recipeID: id,
  });

  if (!response) {
    throw new Error('No Response');
  }

  return response.json();
};

export const getAllTags = async () => {
  const response = await sendRequest(tagsURL(), 'GET');
  if (!response) {
    throw new Error('No Response');
  }

  return response.json();
};

export const getUser = async (userID: string) => {
  const response = await sendRequest(getUserUrl, 'POST', {
    userID,
  });
  if (!response) {
    throw new Error('No Response');
  }

  return response.json();
};

export const getCookList = async () => {
  const response = await sendRequest(getCookListUrl, 'GET');
  if (!response) {
    throw new Error('No Response');
  }

  return response.json();
};

export const getOwnFavorites = async () => {
  const response = await sendRequest(getOwnFavoritesUrl, 'GET');
  if (!response) {
    throw new Error('No Response');
  }

  return response.json();
};

export const checkOwner = async (recipeID: string) => {
  const response = await sendRequest(checkOwnerUrl, 'POST', {
    recipeID,
  });
  if (!response) {
    throw new Error('No Response');
  }

  return response.json();
};

export const getRating = async (recipeID: string) => {
  const response = await sendRequest(ownRatingUrl, 'POST', {
    recipeID,
  });
  if (!response) {
    throw new Error('No Response');
  }

  return response.json();
};

export const getFilteredRecipes = async (filterData: { ratingMin: number, tags: string[], text: string, }) => {
  const response = await sendRequest(recipesFilteredUrl(), 'POST', filterData);
  if (!response) {
    throw new Error('No Response');
  }

  return response.json();
};

export const getBackendVersion = async () => {
  const response = await sendRequest(backendVersionUrl(), 'GET');
  if (!response) {
    throw new Error('No Response');
  }

  return response.json();
};

// eslint-disable-next-line consistent-return
export const getListsRequest = (name: string) => {
  switch (name) {
    case 'Favorites':
      return getOwnFavorites();
    case 'Own recipes':
      return getOwnRecipes();
    case 'Cooklist':
      return getCookList();
    default:
      break;
  }
};
