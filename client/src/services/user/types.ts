import { User } from "@/types";

export type GetAllUsersResponse = {
  message: string;
  users: User[];
};

export type UserResponse = {
  success: boolean;
  message: string;
  user: User;
};
