import { oak } from '../deps.ts';

export interface ctx extends oak.Context {
  user?: {
    _id: string,
    username: string
    password: string
  }
}
