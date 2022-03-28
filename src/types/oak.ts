import { oak } from "../deps.ts";
import { UserLean } from "../users/user_types.ts";

export type CTX = oak.Context<{ user: UserLean }>