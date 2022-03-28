import { oak } from "../deps.ts";

export interface UserLean {
  _id: string,
  username: string
  password: string
}

export interface ctx extends oak.Context {
  user: UserLean
}

export type CreateUser = Omit<UserLean, '_id'>