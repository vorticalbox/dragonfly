import { UserLean } from "../users/user_types.ts";
import Post from './post_model.ts';
import { post_validation } from './post_validations.ts'


export function get_posts(skip: number, limit: number) {
  return Post.skip(skip).limit(limit).orderBy('updatedAt', "desc").all()
}

export function get_post(_id: any) {
  return Post.where({ _id }).all();
}

export function create_post(request_body: Record<string, unknown>, user: UserLean) {
  const { title, body } = post_validation.parse(request_body);
  return Post.create({ title, body, username: user.username });
}

export default {
  get_posts,
  create_post,
}