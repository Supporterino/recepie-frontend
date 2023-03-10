/* eslint-disable import/no-cycle */
import {
  type LoginResponse,
} from '../types';
import sendRequest, {
  refreshTokenUrl,
} from './sendRequest';
import moment from 'moment';

export type AuthData = {
  jwt: string,
  jwtExpiry: Date,
  refreshToken: string,
  refreshTokenExpiry: Date,
  userID: string,
};

class AuthenticationManager {
  private storageKey = 'AUTH_DATA';

  public updateAuthData (data: AuthData) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  private isJWTvalid (): boolean {
    const storeData = localStorage.getItem(this.storageKey);
    if (!storeData) {
      return false;
    }

    return new Date((JSON.parse(storeData) as AuthData).jwtExpiry) > new Date();
  }

  public getJWT (): string {
    const storeData = localStorage.getItem(this.storageKey);
    if (!storeData) {
      return '';
    }

    return (JSON.parse(storeData) as AuthData).jwt;
  }

  private isRefreshTokenValid (): boolean {
    const storeData = localStorage.getItem(this.storageKey);
    if (!storeData) {
      return false;
    }

    return new Date((JSON.parse(storeData) as AuthData).refreshTokenExpiry) > new Date();
  }

  private getRefreshToken (): string {
    const storeData = localStorage.getItem(this.storageKey);
    if (!storeData) {
      return '';
    }

    return (JSON.parse(storeData) as AuthData).refreshToken;
  }

  public hasUser (): boolean {
    const storeData = localStorage.getItem(this.storageKey);
    if (!storeData) {
      return false;
    }

    return Boolean((JSON.parse(storeData) as AuthData).userID);
  }

  private hasJWT (): boolean {
    const storeData = localStorage.getItem(this.storageKey);
    if (!storeData) {
      return false;
    }

    return Boolean((JSON.parse(storeData) as AuthData).jwt);
  }

  private hasRefreshToken (): boolean {
    const storeData = localStorage.getItem(this.storageKey);
    if (!storeData) {
      return false;
    }

    return Boolean((JSON.parse(storeData) as AuthData).refreshToken);
  }

  public getUserID (): string {
    const storeData = localStorage.getItem(this.storageKey);
    if (!storeData) {
      return '';
    }

    return (JSON.parse(storeData) as AuthData).userID;
  }

  public clear () {
    localStorage.removeItem(this.storageKey);
  }

  public async refreshJWT (): Promise<boolean> {
    if (this.hasJWT() && this.isJWTvalid()) {
      return true;
    }

    if (this.hasRefreshToken() && this.isRefreshTokenValid()) {
      const response = await sendRequest(refreshTokenUrl, 'POST', {
        token: this.getRefreshToken(),
      });
      if (!response) {
        this.clear();
        return false;
      }

      const loginData = (await response.json()) as LoginResponse;
      // works ?
      this.updateAuthData({
        jwt: loginData.jwtToken,
        jwtExpiry: moment().add(15, 'm').toDate(),
        refreshToken: loginData.refreshToken,
        refreshTokenExpiry: moment().add(7, 'd').toDate(),
        userID: loginData.userID,
      });
      return true;
    } else {
      this.clear();
      return false;
    }
  }
}

export const authenticationManager = new AuthenticationManager();
