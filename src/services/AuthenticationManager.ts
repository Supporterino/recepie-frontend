import moment from 'moment';
import { LoginResponse } from '../types';
import sendRequest, { refreshTokenUrl } from './requestService';

export type AuthData = {
  jwt: string;
  refreshToken: string;
  userID: string;
  jwtExpiry: Date;
  refreshTokenExpiry: Date;
};

class AuthenticationManager {
  private storageKey = 'AUTH_DATA';

  updateAuthData(data: AuthData) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  isJWTvalid(): boolean {
    const storeData = localStorage.getItem(this.storageKey);
    if (!storeData) return false;
    return (JSON.parse(storeData) as AuthData).jwtExpiry > new Date();
  }

  getJWT(): string {
    const storeData = localStorage.getItem(this.storageKey);
    if (!storeData) return '';
    return (JSON.parse(storeData) as AuthData).jwt;
  }

  isRefreshTokenValid(): boolean {
    const storeData = localStorage.getItem(this.storageKey);
    if (!storeData) return false;
    return (JSON.parse(storeData) as AuthData).refreshTokenExpiry > new Date();
  }

  getRefreshToken(): string {
    const storeData = localStorage.getItem(this.storageKey);
    if (!storeData) return '';
    return (JSON.parse(storeData) as AuthData).refreshToken;
  }

  hasUser(): boolean {
    const storeData = localStorage.getItem(this.storageKey);
    if (!storeData) return false;
    return !!(JSON.parse(storeData) as AuthData).userID;
  }

  hasJWT(): boolean {
    const storeData = localStorage.getItem(this.storageKey);
    if (!storeData) return false;
    return !!(JSON.parse(storeData) as AuthData).jwt;
  }

  hasRefreshToken(): boolean {
    const storeData = localStorage.getItem(this.storageKey);
    if (!storeData) return false;
    return !!(JSON.parse(storeData) as AuthData).refreshToken;
  }

  getUserID(): string {
    const storeData = localStorage.getItem(this.storageKey);
    if (!storeData) return '';
    return (JSON.parse(storeData) as AuthData).userID;
  }

  clear() {
    localStorage.removeItem(this.storageKey);
  }

  async refreshJWT(): Promise<boolean> {
    if (this.hasJWT() && this.isJWTvalid()) return true;
    if (this.hasRefreshToken() && this.isRefreshTokenValid()) {
      const res = await sendRequest(refreshTokenUrl, 'POST', { token: this.getRefreshToken() });
      if (!res) return false;
      const loginData = (await res.json()) as LoginResponse;
      authenticationManager.updateAuthData({
        jwt: loginData.jwtToken,
        refreshToken: loginData.refreshToken,
        userID: loginData.userID,
        jwtExpiry: moment().add(15, 'm').toDate(),
        refreshTokenExpiry: moment().add(7, 'd').toDate()
      });
      return true;
    }
    return false;
  }
}

export const authenticationManager = new AuthenticationManager();
