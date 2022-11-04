import { authenticationManager } from './AuthenticationManager';

const baseUrl = (process.env.REACT_APP_API_URL || 'https://trb.supporterino.de/').trim();
const secured = 'secureApi/';
const unSecured = 'api/';
export const loginUrl = baseUrl + unSecured + 'v1/auth/login';
export const registerUrl = baseUrl + unSecured + 'v1/auth/register';
export const refreshTokenUrl = baseUrl + unSecured + 'v1/auth/refreshToken';
export const addFavoriteUrl = baseUrl + secured + 'v1/favorite/addFavorite';
export const removeFavoriteUrl = baseUrl + secured + 'v1/favorite/removeFavorite';
export const removeCookListUrl = baseUrl + secured + 'v1/cooklist/removeCookList';
export const addCookListUrl = baseUrl + secured + 'v1/cooklist/addCookList';
export const createRecipeUrl = baseUrl + secured + 'v1/recipe-creation/createRecipe';
export const getUserUrl = baseUrl + secured + 'v1/user/getSanitizedUser';
export const getOwnFavoritesUrl = baseUrl + secured + 'v1/favorite/getOwnFavorites';
export const getCookListUrl = baseUrl + secured + 'v1/cooklist/getCookList';
export const imageUploadUrl = baseUrl + 'photosUpload';
export const checkOwnerUrl = baseUrl + secured + 'v1/user/ownsRecipe';
export const editRecipeUrl = baseUrl + secured + 'v1/recipe-updater/updateRecipe';
export const deleteRecipeUrl = baseUrl + secured + 'v1/recipe-deletion/deleteRecipe';
export const addRatingUrl = baseUrl + secured + 'v1/rating/addRating';
export const updateRatingUrl = baseUrl + secured + 'v1/rating/updateRating';
export const ownRatingUrl = baseUrl + secured + 'v1/rating/getRatingForUser';
export const getOwnRecipesUrl = baseUrl + secured + 'v1/recipe-provider/getMyRecipes';
export const completeVerifyUrl = baseUrl + unSecured + 'v1/verification/completeVerification';

export const getByIDUrl = () =>
  baseUrl + (authenticationManager.hasUser() ? secured : unSecured) + 'v1/recipe-provider/getById';
export const receipesURL = () =>
  baseUrl +
  (authenticationManager.hasUser() ? secured : unSecured) +
  'v1/recipe-provider/featuredRecipes';
export const tagsURL = () =>
  baseUrl + (authenticationManager.hasUser() ? secured : unSecured) + 'v1/tags/getAsStrings';
export const backendVersionUrl = () =>
  baseUrl + (authenticationManager.hasUser() ? secured : unSecured) + 'v1/meta/version';
export const recipesFilteredUrl = () =>
  baseUrl + (authenticationManager.hasUser() ? secured : unSecured) + 'v1/recipe-provider/filter';

const getToken = async (): Promise<string> => {
  const validAuth = await authenticationManager.refreshJWT();
  console.log('Has auth:', validAuth);
  if (!validAuth) return '';
  return authenticationManager.getJWT();
};

const buildHeaders = async (isJSON: boolean, needsAuth: boolean): Promise<Headers> => {
  const header: Headers = new Headers();
  if (isJSON) header.set('Content-Type', 'application/json');
  if (needsAuth) {
    const token = await getToken();
    header.set('Authorization', `Token ${token}`);
  }
  return header;
};

const sendRequest = async (url: string, method: string, data?: any, isJSON: boolean = true) => {
  console.log('--- REQUEST ---');
  console.log(url);
  const fetchOptions: RequestInit = {
    method: method,
    headers: await buildHeaders(isJSON, url.includes(secured) || url === imageUploadUrl),
    ...(method !== 'GET' && { body: isJSON ? JSON.stringify(data) : data })
  };
  console.log('--- OPTIONS ---');
  console.log(fetchOptions.headers?.toString());

  try {
    const res: Response | null = await fetch(url, fetchOptions);
    if (!res) throw new Error('No response received');
    console.log('--- RESPONSE ---');
    console.log(res);
    console.log('--- -------- ---');
    if (!res.ok) throw new Error(`Non OK Status code. $${res.status} - ${res.statusText}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export default sendRequest;
