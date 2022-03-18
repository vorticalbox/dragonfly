import { denodb } from '../deps.ts'
const { Model, DataTypes } = denodb;

export class Post extends Model {
  static table = 'posts';
  static fields = {
    _id: {
      primaryKey: true,
    },
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    username: DataTypes.STRING,
  };
  static timestamps = true;
}
export default Post;
