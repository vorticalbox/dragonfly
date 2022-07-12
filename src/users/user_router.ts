import user from './user_handlers.ts';
import validate from '../middleware/validation.ts'
import { oak } from '../deps.ts'
import { register_schema } from './user_validation.ts'

export default function (router: oak.Router) {
  router.post('/register', validate(register_schema), user.register);
  router.post('/login', validate(register_schema), user.login);
}