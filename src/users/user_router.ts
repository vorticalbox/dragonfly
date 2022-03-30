import user from './user_handlers.ts';
import validate from '../middleware/validation.ts'
import { oak } from '../deps.ts'
import { registerSchema } from './user_validation.ts'

export default function (router: oak.Router) {
  router.post('/register', validate(registerSchema), user.register);
  router.post('/login', validate(registerSchema), user.login);
}