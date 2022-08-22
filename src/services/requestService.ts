import { authenticationManager } from './AuthenticationManager';

const baseUrl = (process.env.REACT_APP_API_URL || 'https://trb.supporterino.de/').trim();
const secured = 'secureApi/';
const unSecured = 'api/';
export const loginUrl = baseUrl + unSecured + 'v1/auth/login';
export const registerUrl = baseUrl + unSecured + 'v1/auth/register';
export const refreshTokenUrl = baseUrl + unSecured + 'v1/auth/refreshToken';
export const receipesURL = () =>
  baseUrl +
  (authenticationManager.hasUser() ? secured : unSecured) +
  'v1/recipe-provider/featuredRecipes';

const getToken = async (): Promise<string> => {
  const validAuth = await authenticationManager.refreshJWT();
  console.log(validAuth)
  if (!validAuth) return '';
  return authenticationManager.getJWT();
};

const buildHeaders = async (isJSON: boolean, needsAuth: boolean): Promise<Headers> => {
  const header: Headers = new Headers();
  if (isJSON) header.set('Content-Type', 'application/json');
  if (needsAuth) {
    const token = await getToken()
    header.set('Authorization', `Token ${token}`);
  }
  return header;
};

const sendRequest = async (url: string, method: string, data?: any, isJSON: boolean = true) => {
  const fetchOptions: RequestInit = {
    method: method,
    headers: await buildHeaders(isJSON, url.includes(secured)),
    ...(method !== 'GET' && { body: isJSON ? JSON.stringify(data) : data })
  };

  try {
    const res: Response | null = await fetch(url, fetchOptions);
    if (!res) throw new Error('No response received');
    return res;
  } catch (error) {}
};

export default sendRequest;
