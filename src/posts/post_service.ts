import { UserLean } from "../users/user_types.ts";
import Post from './post_model.ts';
import { postValidation } from './post_validations.ts'


export function get_posts(skip: number, limit: number) {
  return Post.skip(skip).limit(limit).orderBy('updatedAt', "desc").all()
}

export function create_post(requestBody: Record<string, any>, user: UserLean) {
  const { title, body } = postValidation.parse(requestBody);
  return Post.create({ title, body, username: user.username });
}

export default {
  get_posts,
  create_post,
}