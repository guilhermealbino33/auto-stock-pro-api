export interface SingInResponseInterface {
  accessToken: string;
  role: string;
}

export interface RequestUserInterface {
  sub: number;
  name: string;
  username: string;
  role: string;
  code: string;
  url_profile_picture?: string;
  iat: number;
  exp: number;
}
