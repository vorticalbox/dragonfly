import { denodb } from '../deps.ts'
const { Model, DataTypes } = denodb;

export class Comment extends Model {
  static table = 'comments';
  static fields = {
    _id: {
      primaryKey: true,
    },
    post_id: DataTypes.STRING,
    body: DataTypes.STRING,
    username: DataTypes.STRING,
  };
  static timestamps = true;
}
export default Comment;