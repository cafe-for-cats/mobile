import { User } from './user.model';
import users from './user.schema';

export default class UserService {
  public createUser(user_params: User, callback: any) {
    const _session = new users(user_params);
    _session.save(callback);
  }

  public filterUser(query: any, callback: any) {
    users.findOne(query, callback);
  }

  public updateUser(user_params: User, callback: any) {
    const query = { _id: user_params._id };
    users.findOneAndUpdate(query, user_params, callback);
  }

  public deleteUser(_id: String, callback: any) {
    const query = { _id: _id };
    users.deleteOne(query, callback);
  }
}
