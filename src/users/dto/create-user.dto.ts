export class CreateUsersDto {
  email: string;
  nickname: string;
  googleId: string;
  picture?: string | null;
  apiKey?: string | null;
}
