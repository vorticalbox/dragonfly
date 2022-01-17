import { denodb } from '../../deps.ts'
const { Model, DataTypes } = denodb;

export class Session extends Model {
  static table = 'session';
  static fields = {
    _id: {
      primaryKey: true,
    },
    username: DataTypes.STRING,
    token: DataTypes.STRING,
  };
  static timestamps = true;
}
export default Session;