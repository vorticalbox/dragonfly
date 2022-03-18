import { denodb } from '../deps.ts'
const { Model, DataTypes } = denodb;

export class User extends Model {
  static table = 'user';
  static fields = {
    _id: {
      primaryKey: true,
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  };
  static timestamps = true;
}
export default User;