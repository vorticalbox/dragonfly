import { oak } from '../deps.ts';
import { UserLean } from "./controllers/user.ts";

export interface ctx extends oak.Context {
  user: UserLean
}
