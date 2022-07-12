import { IComment, comment_validation } from "./comment_validation.ts";
import { Comment } from './comment_model.ts';


export function getComments(post_id: string, skip: number, limit: number) {
  return Comment.where({ post_id }).skip(skip).limit(limit).orderBy('updatedAt', "desc").all()
}

export function addComment(comment: IComment, username: string) {
  const parsed_comment = comment_validation.parse(comment);
  return Comment.create({ ...parsed_comment, username });
}


export default {
  getComments,
  addComment,
}