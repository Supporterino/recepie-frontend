const baseUrl = (process.env.REACT_APP_API_URL || 'http://trb.supporterino.de/').trim();
const secured = 'secureApi/';
const unSecured = 'api/';

export const loginUrl = baseUrl + unSecured + 'v1/auth/login';
export const registerUrl = baseUrl + unSecured + 'v1/auth/register';

const buildHeaders = (isJSON: boolean): Headers => {
  const header: Headers = new Headers();
  if (isJSON) header.set('Content-Type', 'application/json');
  return header;
};

const logResponseAndRefreshToken = async (res: Response) => {
    console.log(res.status)
    console.log(res.statusText)
    if (res.status === 401) refreshToken()
    else {
        const resData = await res.json()
        console.warn(resData)
    }
}

const refreshToken = () => {

}

export async function unmarshal<T>(res: Response, negativeCallback: Function): Promise<T> {
    if (!res.ok) negativeCallback()
    const data:T = await res.json()
    return data
}

const sendRequest = async (url: string, method: string, data?: any, callback?: Function, isJSON: boolean = true) => {
  const fetchOptions: RequestInit = {
    method: method,
    headers: buildHeaders(isJSON),
    ...(method !== 'GET' && { body: isJSON ? JSON.stringify(data) : data })
  };

  try {
    const res: Response | null = await fetch(url, fetchOptions);
    if (!res) throw new Error('No response received')
    if (!callback) logResponseAndRefreshToken(res)
    else callback(res)
  } catch (error) {}
};

export default sendRequest;
