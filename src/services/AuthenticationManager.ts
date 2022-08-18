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

  getUserID(): string {
    const storeData = localStorage.getItem(this.storageKey);
    if (!storeData) return '';
    return (JSON.parse(storeData) as AuthData).userID;
  }

  clear() {
    localStorage.removeItem(this.storageKey)
  }
}

export const authenticationManager = new AuthenticationManager();
