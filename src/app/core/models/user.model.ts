export interface UserProfile {
  id?: number;
  username: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export interface UpdateProfileDto {
  username?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
}