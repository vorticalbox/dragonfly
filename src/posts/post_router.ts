import post from './post_handlers.ts'
import { oak } from '../deps.ts'

export default function (router: oak.Router) {
  router.get('/post', post.get_posts);
  router.post('/post', post.add_post);
}